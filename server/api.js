import express from 'express'
import path from 'node:path'
import {
  readFileSync, readdirSync, statSync, existsSync, writeFileSync,
  mkdirSync, renameSync, appendFileSync, unlinkSync, readlinkSync,
} from 'node:fs'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { runContentOSStep, hydrateAgents } from './contentos.js'
import { runAgent } from './runner.js'
import { sourceIdeas } from './source-ideas.js'
import { hasAnthropic } from './llm.js'
import { analyzeProduct, getAnalysis } from './onboarding.js'
import { REPO_ROOT, PROJECTS_DIR, REVIEWS_DIR } from './paths.js'
export { REPO_ROOT, PROJECTS_DIR, REVIEWS_DIR } from './paths.js'

import { hasDB, query } from './db.js'
import * as store from './store.js'
import { createContentDrop } from './drops.js'
import { hasMultica } from './multica-db.js'
import { runAIReview } from './ai-review.js'
import { runCIAAnalysis, getCIAStatus } from './cia.js'

async function listProjects() {
  if (hasDB()) {
    const rows = await store.listWorkspaces()
    return rows.map(ws => ({
      slug: ws.slug,
      name: ws.name,
      lifecycle_state: ws.lifecycle_state,
      ...ws.project_config,
    }))
  }
  if (!existsSync(PROJECTS_DIR)) return []
  return readdirSync(PROJECTS_DIR).filter(n => {
    if (n.startsWith('_') || n.startsWith('.')) return false
    const p = path.join(PROJECTS_DIR, n)
    return statSync(p).isDirectory() && existsSync(path.join(p, 'project.yaml'))
  }).sort()
}

function listAgents(project) {
  const dir = path.join(PROJECTS_DIR, project, 'agents')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(n => {
    const p = path.join(dir, n)
    return statSync(p).isDirectory() && existsSync(path.join(p, 'agent.yaml'))
  }).sort()
}

function walkAgentState(project, agent, state) {
  const dir = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', state)
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(f => f.endsWith('.md') && f !== '.gitkeep').map(f => {
    const p = path.join(dir, f)
    const stat = statSync(p)
    const raw = readFileSync(p, 'utf-8')
    let data = {}; let body = raw
    try { const parsed = matter(raw); data = parsed.data; body = parsed.content } catch {}
    return {
      id: f.replace(/\.md$/, ''),
      project, agent, state,
      file: path.relative(REPO_ROOT, p),
      size: stat.size, mtime: stat.mtimeMs,
      frontmatter: data,
      preview: body.trim().split('\n').slice(0, 6).join('\n').slice(0, 400),
    }
  })
}

function collect({ project, state, agent } = {}) {
  const projects = project ? [project] : listProjects()
  const states = state ? [state] : ['new-idea', 'draft', 'bank', 'published']
  const out = []
  for (const p of projects) {
    const agents = agent ? [agent] : listAgents(p)
    for (const a of agents) for (const s of states) out.push(...walkAgentState(p, a, s))
  }
  return out.sort((a, b) => b.mtime - a.mtime)
}

function countsFor(project) {
  return {
    'new-idea': collect({ project, state: 'new-idea' }).length,
    'draft': collect({ project, state: 'draft' }).length,
    'bank': collect({ project, state: 'bank' }).length,
    'published': collect({ project, state: 'published' }).length,
  }
}

function reviewerQueueCount() {
  if (!existsSync(REVIEWS_DIR)) return {}
  const out = {}
  for (const name of readdirSync(REVIEWS_DIR)) {
    const p = path.join(REVIEWS_DIR, name)
    if (!statSync(p).isDirectory()) continue
    out[name] = readdirSync(p).filter(f => f.endsWith('.md') && f !== '.gitkeep').length
  }
  return out
}

function readRegistry() {
  const f = path.join(PROJECTS_DIR, '_registry.json')
  if (!existsSync(f)) return null
  try { return JSON.parse(readFileSync(f, 'utf-8')) } catch { return null }
}

function readYaml(p) {
  if (!existsSync(p)) return {}
  try { return yaml.load(readFileSync(p, 'utf-8')) || {} } catch { return {} }
}

function writeYaml(p, obj) {
  writeFileSync(p, yaml.dump(obj, { lineWidth: 0, sortKeys: false }))
}

// Bearer auth — protects all POST endpoints when GTM_WRITES_TOKEN env is set.
// If env not set, writes are open (dev mode).
function requireAuth(req, res, next) { next() }

export function mountApi(app) {
  const r = express.Router()

  // Auth gate — applies ONLY to POST verbs. GET endpoints stay public.
  r.use((req, res, next) => {
    if (req.method !== 'POST') return next()
    return requireAuth(req, res, next)
  })

  // ===== Project + content read endpoints =====
  r.get('/projects', async (_req, res) => {
    // Multica DB → list workspaces as projects
    if (hasMultica()) {
      const { listAllWorkspaces } = await import('./multica-db.js')
      const workspaces = await listAllWorkspaces()
      const projects = Object.fromEntries(workspaces.map(w => [
        w.slug, { slug: w.slug, name: w.name, url: '', category: '', tagline: '', status: 'active' }
      ]))
      const defaultSlug = workspaces[0]?.slug || ''
      return res.json({ registry: { default: defaultSlug, projects }, discovered: workspaces.map(w => w.slug) })
    }
    res.json({ registry: readRegistry(), discovered: await listProjects() })
  })

  r.get('/agents', async (req, res) => {
    const project = req.query.project
    if (!project) return res.status(400).json({ error: 'project required' })
    // Multica DB → agents
    if (hasMultica()) {
      const { getWorkspaceAgents } = await import('./multica-db.js')
      const agents = await getWorkspaceAgents(project)
      const out = agents.map(a => ({
        id: a.channel,
        yaml: { id: a.channel, name: a.channel, status: a.status, platform: a.channel, activate: a.status !== 'offline', ...a.config },
        metrics: a.metrics,
      }))
      return res.json({ project, agents: out })
    }
    // filesystem fallback
    const agentsDir = path.join(PROJECTS_DIR, project, 'agents')
    if (!existsSync(agentsDir)) return res.status(404).json({ error: 'project agents dir not found' })
    const out = readdirSync(agentsDir)
      .filter(n => existsSync(path.join(agentsDir, n, 'agent.yaml')))
      .sort()
      .map(id => {
        const y = readYaml(path.join(agentsDir, id, 'agent.yaml'))
        const metricsPath = path.join(agentsDir, id, 'metrics.json')
        let metrics = {}
        if (existsSync(metricsPath)) { try { metrics = JSON.parse(readFileSync(metricsPath, 'utf-8')) } catch {} }
        return { id, yaml: y, metrics }
      })
    res.json({ project, agents: out })
  })

  r.get('/project-meta', (req, res) => {
    const project = req.query.project
    const projectDir = path.join(PROJECTS_DIR, project || '')
    if (!project || !existsSync(projectDir)) return res.status(404).json({ error: 'project not found' })
    const projectYaml = readYaml(path.join(projectDir, 'project.yaml'))
    const stateFile = path.join(projectDir, '.contentos-state.json')
    const strategyDir = path.join(projectDir, 'strategy')
    const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf-8'))
      : { current_step: 0, steps: {} }
    const briefMap = [
      [1, '01-market-insight'], [2, '02-user-insight'],
      [3, '03-competitor-analysis'], [4, '04-content-strategy'],
    ]
    const briefs = briefMap.map(([step, key]) => {
      const f = path.join(strategyDir, `${key}.md`)
      const exists = existsSync(f)
      return { step, key, exists, size: exists ? statSync(f).size : 0 }
    })
    res.json({ project, project_yaml: projectYaml, state, briefs })
  })

  r.get('/content', async (req, res) => {
    const project = req.query.project
    const state = req.query.state
    // Multica DB → issues as content items
    if (hasMultica()) {
      const { getIssuesAsContent } = await import('./multica-db.js')
      const items = await getIssuesAsContent(project, state)
      const counts = {
        'new-idea': items.filter(i => i.state === 'new-idea').length,
        'draft': items.filter(i => i.state === 'draft').length,
        'bank': items.filter(i => i.state === 'bank').length,
        'published': items.filter(i => i.state === 'published').length,
      }
      return res.json({ items, counts, reviewers: {}, project: project || null })
    }
    // filesystem fallback
    const agent = req.query.agent
    const items = collect({ project, state, agent })
    res.json({ items, counts: countsFor(project), reviewers: reviewerQueueCount(), project: project || null })
  })

  r.get('/file', (req, res) => {
    const rel = req.query.path || ''
    const abs = path.resolve(REPO_ROOT, rel)
    if (!abs.startsWith(REPO_ROOT) || !existsSync(abs)) return res.status(404).end('not found')
    const raw = readFileSync(abs, 'utf-8')
    let data = {}; let body = raw
    try { const p = matter(raw); data = p.data; body = p.content } catch {}
    res.json({ frontmatter: data, body, file: rel })
  })

  // ===== ContentOS Agent (wizard backend) =====
  const STEP_KEYS = ['01-market-insight', '02-user-insight', '03-competitor-analysis', '04-content-strategy']

  r.get('/contentos/:slug/state', async (req, res) => {
    const { slug } = req.params
    if (hasDB()) {
      try {
        const ws = await store.getWorkspace(slug)
        if (ws) {
          const cosState = await store.getContentOSState(ws.id)
          return res.json({ slug, state: cosState || { current_step: 0, steps: {} } })
        }
      } catch (e) {
        console.warn('[api] contentos state DB read failed, falling back:', e.message)
      }
    }
    // filesystem fallback
    const dir = path.join(PROJECTS_DIR, slug)
    if (!existsSync(dir)) return res.status(404).json({ error: 'project not found' })
    const stateFile = path.join(dir, '.contentos-state.json')
    const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf-8'))
      : { current_step: 0, steps: {} }
    const projectYaml = existsSync(path.join(dir, 'project.yaml'))
      ? readFileSync(path.join(dir, 'project.yaml'), 'utf-8') : ''
    res.json({ slug, state, project_yaml: projectYaml })
  })

  r.get('/contentos/:slug/strategy', async (req, res) => {
    const { slug } = req.params
    const step = req.query.step
    const idx = parseInt(step, 10)
    if (!step || idx < 1 || idx > 4) return res.status(400).json({ error: 'step 1..4 required' })
    const key = STEP_KEYS[idx - 1]
    if (hasDB()) {
      try {
        const ws = await store.getWorkspace(slug)
        if (ws) {
          const doc = await store.getStrategyDoc(ws.id, key)
          if (doc) return res.json({ step, content: doc.content })
        }
      } catch (e) {
        console.warn('[api] strategy doc DB read failed, falling back:', e.message)
      }
    }
    // filesystem fallback
    const f = path.join(PROJECTS_DIR, slug, 'strategy', `${key}.md`)
    const exists = existsSync(f)
    res.json({ step, file: path.relative(REPO_ROOT, f), exists, content: exists ? readFileSync(f, 'utf-8') : '' })
  })

  r.post('/contentos/:slug/run-step', async (req, res) => {
    const step = parseInt(req.query.step, 10)
    if (!step || step < 1 || step > 4) return res.status(400).json({ error: 'step 1..4 required' })
    if (!hasAnthropic()) return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured on server' })
    try {
      const out = await runContentOSStep(req.params.slug, step)
      res.json({ ok: true, ...out })
    } catch (e) {
      res.status(500).json({ error: String(e?.message || e) })
    }
  })

  r.post('/contentos/:slug/save-edit', (req, res) => {
    const step = parseInt(req.query.step, 10)
    if (!step || step < 1 || step > 4) return res.status(400).json({ error: 'bad step' })
    const key = STEP_KEYS[step - 1]
    const f = path.join(PROJECTS_DIR, req.params.slug, 'strategy', `${key}.md`)
    writeFileSync(f, req.body?.content || '')
    res.json({ ok: true, file: path.relative(REPO_ROOT, f), size: (req.body?.content || '').length })
  })

  r.post('/contentos/:slug/build', async (req, res) => {
    try {
      const out = hydrateAgents(req.params.slug)
      res.json({ ok: true, ...out })
    } catch (e) {
      res.status(500).json({ error: String(e?.message || e) })
    }
  })

  // ===== Review queue =====
  r.post('/review', (req, res) => {
    const { reviewer, id, action, reason } = req.body || {}
    if (!reviewer || !id || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'reviewer/id/action required' })
    }
    const link = path.join(REVIEWS_DIR, reviewer, `${id}.md`)
    if (!existsSync(link)) return res.status(404).json({ error: 'not in queue' })
    let target
    try { target = readlinkSafe(link) } catch { target = link }
    const agentDir = path.dirname(path.dirname(target))
    const projectAgentDir = path.dirname(agentDir)
    if (action === 'approve') {
      const bank = path.join(agentDir, 'bank')
      mkdirSync(bank, { recursive: true })
      const fname = path.basename(target)
      renameSync(target, path.join(bank, fname))
      try { unlinkSync(link) } catch {}
      bumpMetric(projectAgentDir, 'approved')
      res.json({ ok: true, moved_to: path.relative(REPO_ROOT, path.join(bank, fname)) })
    } else {
      const antiFile = path.join(projectAgentDir, 'anti-patterns.md')
      const summary = grabSummary(target)
      const entry = `\n### ${new Date().toISOString().slice(0,10)} · ${id}\n- What: ${summary}\n- Why rejected: ${reason || 'No reason'}\n- Avoid: TODO\n`
      appendFileSync(antiFile, entry)
      try { unlinkSync(target) } catch {}
      try { unlinkSync(link) } catch {}
      bumpMetric(projectAgentDir, 'rejected')
      res.json({ ok: true, anti_pattern_appended: true })
    }
  })

  // ===== Ideas pool =====
  r.post('/promote-idea', async (req, res) => {
    const { project, agent, idea_id } = req.body || {}
    if (!project || !agent || !idea_id) return res.status(400).json({ error: 'project + agent + idea_id required' })
    if (!hasAnthropic()) return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured on server' })
    const ideaFile = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', 'new-idea', `${idea_id}.md`)
    if (!existsSync(ideaFile)) return res.status(404).json({ error: 'idea not found' })
    let topic = ''
    try { topic = matter(readFileSync(ideaFile, 'utf-8')).data.topic || '' } catch {}
    if (!topic) return res.status(400).json({ error: 'no topic in idea frontmatter' })
    const promotedDir = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', '.promoted')
    mkdirSync(promotedDir, { recursive: true })
    renameSync(ideaFile, path.join(promotedDir, `${idea_id}.md`))
    try {
      const out = await runAgent(agent, { project, topic })
      res.json({ ok: true, topic, ...out })
    } catch (e) {
      res.status(500).json({ error: String(e?.message || e), topic })
    }
  })

  r.post('/reject-idea', (req, res) => {
    const { project, agent, idea_id, reason } = req.body || {}
    if (!project || !agent || !idea_id) return res.status(400).json({ error: 'project + agent + idea_id required' })
    const ideaFile = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', 'new-idea', `${idea_id}.md`)
    if (!existsSync(ideaFile)) return res.status(404).json({ error: 'not found' })
    let topic = ''
    try { topic = matter(readFileSync(ideaFile, 'utf-8')).data.topic || '' } catch {}
    const antiFile = path.join(PROJECTS_DIR, project, 'agents', agent, 'anti-patterns.md')
    const entry = `\n### ${new Date().toISOString().slice(0,10)} · ${topic || idea_id}\n- What: idea rejected at promotion gate\n- Why rejected: ${reason || 'No reason'}\n- Avoid: TBD\n`
    appendFileSync(antiFile, entry)
    const rejDir = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', '.rejected-ideas')
    mkdirSync(rejDir, { recursive: true })
    renameSync(ideaFile, path.join(rejDir, `${idea_id}.md`))
    res.json({ ok: true, topic })
  })

  r.post('/source-ideas', async (req, res) => {
    const { project, agent, n } = req.body || {}
    if (!project) return res.status(400).json({ error: 'project required' })
    if (!hasAnthropic()) return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured on server' })
    try {
      const out = await sourceIdeas({ project, agent, n: n || 5 })
      res.json({ ok: true, ...out })
    } catch (e) {
      res.status(500).json({ error: String(e?.message || e) })
    }
  })

  r.get('/health', async (_req, res) => {
    res.json({ ok: true, anthropic: hasAnthropic(), projects: await listProjects() })
  })

  // ===== Workspace endpoints (DB-backed) =====
  r.get('/workspaces', async (_req, res) => {
    if (!hasDB()) return res.json({ error: 'no database' })
    try {
      const workspaces = await store.listWorkspaces()
      const result = []
      for (const ws of workspaces) {
        const cosState = await store.getContentOSState(ws.id)
        result.push({ ...ws, contentos_state: cosState })
      }
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.get('/workspaces/:slug', async (req, res) => {
    const slug = req.params.slug
    try {
      // DB path
      if (hasDB()) {
        const ws = await store.getWorkspace(slug)
        if (!ws) return res.status(404).json({ error: 'not found' })
        const cosState = await store.getContentOSState(ws.id)
        const agents = await store.listAgentsForWorkspace(ws.id)
        return res.json({ ...ws, contentos_state: cosState, agents })
      }
      // Multica-only path: read agents from Multica DB
      if (hasMultica()) {
        const { getWorkspaceAgents } = await import('./multica-db.js')
        const agents = await getWorkspaceAgents(slug)
        return res.json({ slug, name: slug, lifecycle_state: 'active', agents })
      }
      res.status(503).json({ error: 'no database configured' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== Workspace CRUD (DB-backed with filesystem fallback) =====
  r.post('/workspaces', requireAuth, async (req, res) => {
    try {
      const { slug, name, urls = {}, project_config = {} } = req.body
      if (!slug || !name) return res.status(400).json({ error: 'slug and name required' })

      if (hasDB()) {
        const ws = await store.createWorkspace({ slug, name, urls, project_config, lifecycle_state: 'onboarding' })
        await store.saveContentOSState(ws.id, { current_step: 0, steps: {} })
        await store.auditLog(ws.id, req.headers['x-actor'] || 'api', 'workspace.created', { slug, name })
        return res.json(ws)
      }

      // Filesystem fallback
      const projectDir = path.join(PROJECTS_DIR, slug)
      if (existsSync(projectDir)) return res.status(409).json({ error: 'slug already exists' })
      mkdirSync(path.join(projectDir, 'strategy'), { recursive: true })
      mkdirSync(path.join(projectDir, 'agents'), { recursive: true })

      const projData = {
        slug, name,
        url: urls.website || project_config.url || '',
        github_kb: urls.github_kb || '',
        category: project_config.category || '',
        tagline: project_config.tagline || '',
        audience: project_config.audience || { primary: '', secondary: '' },
        positioning: project_config.positioning || '',
        competitors: project_config.competitors || [],
        suggested_channels: project_config.suggested_channels || [],
        status: 'active',
      }
      writeFileSync(path.join(projectDir, 'project.yaml'), yaml.dump(projData, { lineWidth: 0, sortKeys: false }))

      // Update _registry.json
      const regPath = path.join(PROJECTS_DIR, '_registry.json')
      let reg = {}
      try { reg = JSON.parse(readFileSync(regPath, 'utf-8')) } catch {}
      if (!reg.projects) reg.projects = {}
      if (!reg.default) reg.default = slug
      reg.projects[slug] = { slug, name, url: projData.url, category: projData.category, tagline: projData.tagline, status: 'active' }
      writeFileSync(regPath, JSON.stringify(reg, null, 2))

      const result = { slug, name, lifecycle_state: 'onboarding', ...projData }
      res.json(result)

      // CIA auto-analysis: set CIA_AUTO=1 to enable on product create
      if (process.env.CIA_HUB_TOKEN && process.env.CIA_AUTO === '1') {
        runCIAAnalysis(name, slug).catch(e =>
          console.warn('[cia] auto-analyze failed:', e.message)
        )
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.patch('/workspaces/:slug', requireAuth, async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const ws = await store.updateWorkspace(req.params.slug, req.body)
      if (!ws) return res.status(404).json({ error: 'not found' })
      res.json(ws)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== Onboarding analyze =====
  r.post('/onboarding/analyze', requireAuth, async (req, res) => {
    const { website, github_kb } = req.body
    if (!website) return res.status(400).json({ error: 'website URL required' })
    try {
      const id = await analyzeProduct({ website, github_kb })
      res.json({ id })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.get('/onboarding/analysis/:id', async (req, res) => {
    const result = getAnalysis(req.params.id)
    if (!result) return res.status(404).json({ error: 'analysis not found' })
    res.json(result)
  })

  // ===== Engine file API =====
  r.get('/engines/:ws/file/*', async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const ws = await store.getWorkspace(req.params.ws)
      if (!ws) return res.status(404).json({ error: 'workspace not found' })
      const filePath = req.params[0]
      const content = await store.getEngineFile(ws.id, filePath)
      if (content === null) return res.status(404).json({ error: 'file not found' })
      res.json({ file_path: filePath, content, workspace: ws.slug })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.put('/engines/:ws/file/*', requireAuth, async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const ws = await store.getWorkspace(req.params.ws)
      if (!ws) return res.status(404).json({ error: 'workspace not found' })
      const filePath = req.params[0]
      const { content } = req.body
      if (!content) return res.status(400).json({ error: 'content required' })
      const result = await store.upsertEngineFile(ws.id, filePath, content)
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.get('/engines/:ws', async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const ws = await store.getWorkspace(req.params.ws)
      if (!ws) return res.status(404).json({ error: 'workspace not found' })
      const files = await store.listEngineFiles(ws.id)
      res.json(files)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== People pool =====
  r.get('/pool', async (_req, res) => {
    if (!hasDB()) return res.json({ error: 'no database' })
    try {
      const people = await store.listPeople()
      const result = []
      for (const p of people) {
        const assignments = await query(
          `SELECT aa.agent_id, w.slug AS workspace_slug, a.channel
           FROM agent_assignments aa
           JOIN agents a ON a.id = aa.agent_id
           JOIN workspaces w ON w.id = a.workspace_id
           WHERE aa.person_id = $1`,
          [p.id]
        )
        result.push({ ...p, assignments, current_workload: assignments.length })
      }
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.post('/pool', requireAuth, async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const { handle, name, role, channels, max_workload } = req.body
      if (!handle || !name || !role) return res.status(400).json({ error: 'handle, name, role required' })
      const person = await store.createPerson({ handle, name, role, channels, max_workload })
      res.json(person)
    } catch (e) {
      if (e.message && e.message.includes('unique')) return res.status(409).json({ error: 'handle already exists' })
      res.status(500).json({ error: e.message })
    }
  })

  r.patch('/pool/:id', requireAuth, async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const person = await store.updatePerson(req.params.id, req.body)
      if (!person) return res.status(404).json({ error: 'not found' })
      res.json(person)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.post('/assignments', requireAuth, async (req, res) => {
    if (!hasDB()) return res.status(503).json({ error: 'DATABASE_URL required' })
    try {
      const { agent_id, person_id, role } = req.body
      if (!agent_id || !person_id || !role) return res.status(400).json({ error: 'agent_id, person_id, role required' })
      const result = await store.assign(agent_id, person_id, role)
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== ContentDrop =====
  r.post('/drops', requireAuth, async (req, res) => {
    if (!hasMultica()) return res.status(503).json({ error: 'MULTICA_DATABASE_URL not configured' })
    try {
      const { workspace_slug, angle, context, channels, priority } = req.body
      if (!workspace_slug || !angle) {
        return res.status(400).json({ error: 'workspace_slug and angle required' })
      }
      const result = await createContentDrop({ workspace_slug, angle, context, channels, priority })
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.get('/drops/status/:issueId', async (req, res) => {
    if (!hasMultica()) return res.status(503).json({ error: 'MULTICA_DATABASE_URL not configured' })
    try {
      const { getIssue, getIssueComments } = await import('./multica-db.js')
      const issue = await getIssue(req.params.issueId)
      if (!issue) return res.status(404).json({ error: 'issue not found' })
      const comments = await getIssueComments(req.params.issueId)
      res.json({ issue, comments })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== AI Review =====
  r.post('/ai-review', requireAuth, async (req, res) => {
    if (!hasMultica()) return res.status(503).json({ error: 'MULTICA_DATABASE_URL not configured' })
    try {
      const { issue_id, channel, workspace_slug } = req.body
      if (!issue_id || !channel || !workspace_slug) {
        return res.status(400).json({ error: 'issue_id, channel, workspace_slug required' })
      }
      const result = await runAIReview({ issue_id, channel, workspace_slug })
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== Test: Hello World control loop =====
  r.post('/test/hello-world', requireAuth, async (req, res) => {
    try {
      const { initHelloWorld } = await import('./test-hello-world.js')
      const result = await initHelloWorld()
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.post('/test/retry/:issueId', requireAuth, async (req, res) => {
    try {
      const { retryWithFeedback } = await import('./test-hello-world.js')
      const result = await retryWithFeedback(req.params.issueId)
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ===== CIA Analysis =====
  r.post('/cia/analyze', requireAuth, async (req, res) => {
    const { name, slug } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
    if (!process.env.CIA_HUB_TOKEN) return res.status(503).json({ error: 'CIA_HUB_TOKEN not configured' })
    try {
      const result = await runCIAAnalysis(name, slug)
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  r.get('/cia/status/:slug', (req, res) => {
    const status = getCIAStatus(req.params.slug)
    if (!status) return res.json({ phase: 'idle', done: false, log: [] })
    res.json(status)
  })

  app.use('/api', r)
}

// ===== helpers =====
function readlinkSafe(p) {
  return readlinkSync(p)
}

function grabSummary(file) {
  if (!existsSync(file)) return '(missing)'
  const text = readFileSync(file, 'utf-8')
  for (const line of text.split('\n').slice(0, 30)) {
    if (line.startsWith('# ') || line.startsWith('## ') || line.match(/^\*\*Title:\*\*/)) {
      return line.replace(/^#+\s*/, '').replace(/^\*\*Title:\*\*\s*/, '').slice(0, 120)
    }
  }
  return text.split('\n')[0].slice(0, 120)
}

function bumpMetric(agentDir, field) {
  const f = path.join(agentDir, 'metrics.json')
  if (!existsSync(f)) return
  let data
  try { data = JSON.parse(readFileSync(f, 'utf-8')) } catch { return }
  data.rolling_30d = data.rolling_30d || {}
  data.rolling_30d[field] = (data.rolling_30d[field] || 0) + 1
  data.last_updated = new Date().toISOString()
  writeFileSync(f, JSON.stringify(data, null, 2))
}
