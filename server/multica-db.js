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
  // Try upsert; fall back to SELECT if no unique constraint on (workspace_id, name)
  try {
    const row = await q1(
      `INSERT INTO agent (workspace_id, name, runtime_mode, runtime_config, status)
       VALUES ($1, $2, 'cloud', $3, 'idle')
       ON CONFLICT (workspace_id, name) DO UPDATE SET runtime_config = EXCLUDED.runtime_config
       RETURNING id`,
      [workspaceId, name, JSON.stringify({ gtm_channel: channel })]
    )
    if (row) return row.id
  } catch {}
  const existing = await q1(
    'SELECT id FROM agent WHERE workspace_id = $1 AND name = $2',
    [workspaceId, name]
  )
  return existing?.id
}

export async function getOrCreateLabel(workspaceId, name, color) {
  try {
    const row = await q1(
      `INSERT INTO issue_label (workspace_id, name, color) VALUES ($1, $2, $3)
       ON CONFLICT (workspace_id, name) DO UPDATE SET color = EXCLUDED.color RETURNING id`,
      [workspaceId, name, color]
    )
    if (row) return row.id
  } catch {}
  const existing = await q1(
    'SELECT id FROM issue_label WHERE workspace_id = $1 AND name = $2',
    [workspaceId, name]
  )
  return existing?.id
}

export async function createIssue(workspaceId, {
  title, description = '', status = 'in_progress', priority = 'medium',
  parentId = null, creatorId,
}) {
  const row = await q1(
    `INSERT INTO issue
       (workspace_id, title, description, status, priority, parent_issue_id, creator_type, creator_id)
     VALUES ($1, $2, $3, $4, $5, $6, 'agent', $7)
     RETURNING id`,
    [workspaceId, title, description, status, priority, parentId || null, creatorId]
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
