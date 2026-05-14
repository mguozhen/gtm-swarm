// server/multica-db.js
import pg from 'pg'
const { Pool } = pg

let pool = null

export function hasMultica() {
  return Boolean(process.env.MULTICA_DATABASE_URL)
}

function getPool() {
  if (!pool && hasMultica()) {
    const url = process.env.MULTICA_DATABASE_URL
    pool = new Pool({
      connectionString: url,
      ssl: url.includes('localhost') || url.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
    })
  }
  return pool
}

async function q(sql, params = []) {
  const p = getPool()
  if (!p) throw new Error('No MULTICA_DATABASE_URL set')
  const { rows } = await p.query(sql, params)
  return rows
}

async function q1(sql, params = []) {
  return (await q(sql, params))[0] || null
}

export async function getWorkspaceBySlug(slug) {
  return q1('SELECT id, slug, name FROM workspace WHERE slug = $1', [slug])
}

export async function getOrCreateWorkspace(slug, name) {
  const row = await q1(
    `INSERT INTO workspace (name, slug) VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
    [name, slug]
  )
  return row.id
}

export async function getOrCreateGTMUser() {
  const email = 'gtm-swarm-bot@gtm-swarm.internal'
  const row = await q1(
    `INSERT INTO "user" (name, email) VALUES ('GTM Swarm', $1)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
    [email]
  )
  return row.id
}

export async function upsertMember(workspaceId, userId, role = 'member') {
  await q(
    `INSERT INTO member (workspace_id, user_id, role) VALUES ($1, $2, $3)
     ON CONFLICT (workspace_id, user_id) DO NOTHING`,
    [workspaceId, userId, role]
  )
}

export async function upsertChannelAgent(workspaceId, channel) {
  const name = `GTM-${channel.charAt(0).toUpperCase() + channel.slice(1)}`
  try {
    const existing = await q1(
      'SELECT id FROM agent WHERE workspace_id = $1 AND name = $2',
      [workspaceId, name]
    )
    if (existing) return existing.id
    const row = await q1(
      `INSERT INTO agent (workspace_id, name, runtime_mode, runtime_config, status)
       VALUES ($1, $2, 'cloud', $3, 'idle') RETURNING id`,
      [workspaceId, name, JSON.stringify({ gtm_channel: channel })]
    )
    return row?.id
  } catch (e) {
    // Agent table schema may require extra fields (e.g. runtime_id) — skip silently
    console.warn(`[multica-db] upsertChannelAgent ${channel} skipped:`, e.message.split('\n')[0])
    return null
  }
}

export async function getOrCreateLabel(workspaceId, name, color) {
  const existing = await q1(
    'SELECT id FROM issue_label WHERE workspace_id = $1 AND name = $2',
    [workspaceId, name]
  )
  if (existing) return existing.id
  const row = await q1(
    'INSERT INTO issue_label (workspace_id, name, color) VALUES ($1, $2, $3) RETURNING id',
    [workspaceId, name, color]
  )
  return row?.id
}

export async function createIssue(workspaceId, {
  title, description = '', status = 'in_progress', priority = 'medium',
  parentId = null, creatorId, assigneeId = null,
}) {
  const row = await q1(
    `INSERT INTO issue
       (workspace_id, title, description, status, priority, parent_issue_id, creator_type, creator_id, number, assignee_id, assignee_type)
     VALUES ($1, $2, $3, $4, $5, $6, 'agent', $7,
       (SELECT COALESCE(MAX(number), 0) + 1 FROM issue WHERE workspace_id = $1),
       $8, $9)
     RETURNING id`,
    [workspaceId, title, description, status, priority, parentId || null, creatorId, assigneeId || null, assigneeId ? 'agent' : null]
  )
  return row.id
}

export async function addIssueLabel(issueId, labelId) {
  await q(
    `INSERT INTO issue_to_label (issue_id, label_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [issueId, labelId]
  )
}

export async function postComment(issueId, { body, authorId, authorType = 'agent' }) {
  const row = await q1(
    `INSERT INTO comment (issue_id, body, author_type, author_id)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [issueId, body, authorType, authorId]
  )
  return row.id
}

export async function updateIssueStatus(issueId, status) {
  await q(
    'UPDATE issue SET status = $1, updated_at = now() WHERE id = $2',
    [status, issueId]
  )
}

export async function getIssue(issueId) {
  return q1('SELECT * FROM issue WHERE id = $1', [issueId])
}

export async function getIssueComments(issueId) {
  return q(
    'SELECT * FROM comment WHERE issue_id = $1 ORDER BY created_at ASC',
    [issueId]
  )
}

export async function getWorkspaceAgents(workspaceSlug) {
  const ws = await q1('SELECT id FROM workspace WHERE slug = $1', [workspaceSlug])
  if (!ws) return []
  const agents = await q(
    `SELECT a.id, a.name, a.status, a.runtime_config, a.runtime_mode
     FROM agent a WHERE a.workspace_id = $1 ORDER BY a.name`,
    [ws.id]
  )

  // Get issue counts per agent from last 30 days
  const counts = await q(
    `SELECT assignee_id,
       COUNT(*) FILTER (WHERE status IN ('in_progress','in_review')) AS drafted,
       COUNT(*) FILTER (WHERE status = 'done') AS approved,
       COUNT(*) FILTER (WHERE status = 'cancelled') AS rejected,
       COUNT(*) FILTER (WHERE status = 'done') AS published
     FROM issue
     WHERE workspace_id = $1
       AND created_at > now() - interval '30 days'
       AND assignee_id IS NOT NULL
     GROUP BY assignee_id`,
    [ws.id]
  )
  const metricsMap = Object.fromEntries(counts.map(c => [c.assignee_id, {
    rolling_30d: {
      drafted: Number(c.drafted),
      approved: Number(c.approved),
      rejected: Number(c.rejected),
      published: Number(c.published),
    }
  }]))

  return agents.map(a => {
    let cfg = {}
    try { cfg = typeof a.runtime_config === 'string' ? JSON.parse(a.runtime_config) : (a.runtime_config || {}) } catch {}
    return {
      id: a.id,
      name: a.name,
      channel: cfg.gtm_channel || a.name.replace(/^GTM-/i, '').toLowerCase(),
      status: a.status || 'active',
      config: cfg,
      metrics: metricsMap[a.id] || { rolling_30d: { drafted: 0, approved: 0, rejected: 0, published: 0 } },
      review_checklist: [],
      dashboard_widgets: [],
      kpi_defaults: {},
    }
  })
}

export async function listAllWorkspaces() {
  return q('SELECT id, slug, name FROM workspace ORDER BY name')
}

export async function getIssuesAsContent(workspaceSlug, statusFilter) {
  const ws = await q1('SELECT id FROM workspace WHERE slug = $1', [workspaceSlug])
  if (!ws) return []

  // Map Multica statuses to gtm-swarm content states
  const STATUS_MAP = {
    backlog: 'new-idea',
    todo: 'new-idea',
    in_progress: 'draft',
    in_review: 'draft',
    done: 'bank',
    cancelled: 'draft',
  }

  // Ideas = top-level issues (no parent), everything else = child issues (assigned to agents)
  const isIdea = statusFilter === 'new-idea'

  let sql = `
    SELECT i.id, i.title, i.description, i.status, i.created_at, i.updated_at,
           a.name AS agent_name
    FROM issue i
    LEFT JOIN agent a ON a.id = i.assignee_id
    WHERE i.workspace_id = $1
      AND i.parent_issue_id IS ${isIdea ? 'NULL' : 'NOT NULL'}`
  const params = [ws.id]

  if (statusFilter) {
    // reverse map: content state → multica statuses
    const reverse = { 'new-idea': ['backlog','todo'], 'draft': ['in_progress','in_review'], 'bank': ['done'], 'published': ['done'] }
    const statuses = reverse[statusFilter] || []
    if (statuses.length) {
      sql += ` AND i.status = ANY($2)`
      params.push(statuses)
    }
  }
  sql += ' ORDER BY i.updated_at DESC LIMIT 100'

  const rows = await q(sql, params)
  return rows.map(r => ({
    id: r.id,
    project: workspaceSlug,
    agent: r.agent_name || 'unknown',
    state: STATUS_MAP[r.status] || 'draft',
    file: `multica://${r.id}`,
    size: (r.description || '').length,
    mtime: new Date(r.updated_at || r.created_at).getTime(),
    frontmatter: { topic: r.title, status: STATUS_MAP[r.status] || 'draft' },
    preview: (r.description || '').replace(/^#+.+\n/gm, '').trim().slice(0, 400),
  }))
}

export async function pollIssueDone(issueId, onDone, intervalMs = 5000, maxWaitMs = 1800000) {
  const start = Date.now()
  const check = async () => {
    if (Date.now() - start > maxWaitMs) return
    const issue = await getIssue(issueId)
    if (!issue) return
    if (issue.status === 'done' || issue.status === 'cancelled') {
      onDone(issue.status)
      return
    }
    setTimeout(check, intervalMs)
  }
  setTimeout(check, intervalMs)
}
