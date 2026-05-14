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
import { buildLedger } from './ledger.js'
import { buildNorthStar, appendActual } from './north-star.js'
import { appendBuilderLog, readBuilderLog, readAllBuilderLogs } from './builder-log.js'
import { hasAnthropic } from './llm.js'
import { REPO_ROOT, PROJECTS_DIR, REVIEWS_DIR } from './paths.js'
export { REPO_ROOT, PROJECTS_DIR, REVIEWS_DIR } from './paths.js'

function listProjects() {
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
function requireAuth(req, res, next) {
  const expected = process.env.GTM_WRITES_TOKEN
  if (!expected) return next()
  const header = req.get('authorization') || ''
  const m = header.match(/^Bearer\s+(.+)$/i)
  if (!m || m[1] !== expected) {
    return res.status(401).json({ error: 'Missing or invalid Bearer token. Set token via frontend "Sign in" or pass Authorization: Bearer <token>.' })
  }
  next()
}

export function mountApi(app) {
  const r = express.Router()

  // Auth gate — applies ONLY to POST verbs. GET endpoints stay public.
  r.use((req, res, next) => {
    if (req.method !== 'POST') return next()
    return requireAuth(req, res, next)
  })

  // ===== Project + content read endpoints =====
  r.get('/projects', (_req, res) => {
    res.json({ registry: readRegistry(), discovered: listProjects() })
  })

  r.get('/agents', (req, res) => {
    const project = req.query.project
    const agentsDir = path.join(PROJECTS_DIR, project || '', 'agents')
    if (!project || !existsSync(agentsDir)) {
      return res.status(404).json({ error: 'project agents dir not found' })
    }
    const out = readdirSync(agentsDir)
      .filter(n => existsSync(path.join(agentsDir, n, 'agent.yaml')))
      .sort()
      .map(id => {
        const y = readYaml(path.join(agentsDir, id, 'agent.yaml'))
        const metricsPath = path.join(agentsDir, id, 'metrics.json')
        let metrics = {}
        if (existsSync(metricsPath)) {
          try { metrics = JSON.parse(readFileSync(metricsPath, 'utf-8')) } catch {}
        }
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

  r.get('/content', (req, res) => {
    const project = req.query.project
    const state = req.query.state
    const agent = req.query.agent
    const items = collect({ project, state, agent })
    res.json({
      items,
      counts: countsFor(project),
      reviewers: reviewerQueueCount(),
      project: project || null,
    })
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

  r.get('/contentos/:slug/state', (req, res) => {
    const dir = path.join(PROJECTS_DIR, req.params.slug)
    if (!existsSync(dir)) return res.status(404).json({ error: 'project not found' })
    const stateFile = path.join(dir, '.contentos-state.json')
    const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf-8'))
      : { current_step: 0, steps: {} }
    const projectYaml = existsSync(path.join(dir, 'project.yaml'))
      ? readFileSync(path.join(dir, 'project.yaml'), 'utf-8') : ''
    res.json({ slug: req.params.slug, state, project_yaml: projectYaml })
  })

  r.get('/contentos/:slug/strategy', (req, res) => {
    const step = req.query.step
    const idx = parseInt(step, 10)
    if (!step || idx < 1 || idx > 4) return res.status(400).json({ error: 'step 1..4 required' })
    const key = STEP_KEYS[idx - 1]
    const f = path.join(PROJECTS_DIR, req.params.slug, 'strategy', `${key}.md`)
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

  r.get('/ledger', (req, res) => {
    const project = req.query.project || 'voc-ai'
    const windowHours = parseInt(req.query.window_hours || '168', 10)
    try {
      res.json(buildLedger(String(project), { windowHours }))
    } catch (e) {
      res.status(404).json({ error: e?.message || String(e) })
    }
  })

  r.get('/north-star', (req, res) => {
    const project = req.query.project || 'voc-ai'
    try { res.json(buildNorthStar(String(project))) }
    catch (e) { res.status(404).json({ error: e?.message || String(e) }) }
  })

  r.post('/north-star/actual', (req, res) => {
    const { project, date, traffic, registrations, payments, revenue_usd, note } = req.body || {}
    if (!project) return res.status(400).json({ error: 'project required' })
    try {
      const out = appendActual(String(project), { date, traffic, registrations, payments, revenue_usd, note, entered_by: 'dashboard' })
      res.json({ ok: true, entry: out })
    } catch (e) {
      res.status(400).json({ error: e?.message || String(e) })
    }
  })

  r.post('/builder-log', (req, res) => {
    const { project, agent, builder, value_point, product_update, target_update, note, date } = req.body || {}
    if (!project || !agent) return res.status(400).json({ error: 'project + agent required' })
    try {
      const row = appendBuilderLog(String(project), String(agent), { builder, value_point, product_update, target_update, note, date })
      res.json({ ok: true, entry: row })
    } catch (e) {
      res.status(400).json({ error: e?.message || String(e) })
    }
  })

  r.get('/builder-log', (req, res) => {
    const project = req.query.project
    const agent = req.query.agent
    const sinceHours = parseInt(req.query.since_hours || '720', 10) // 30d
    const limit = parseInt(req.query.limit || '50', 10)
    if (!project) return res.status(400).json({ error: 'project required' })
    try {
      if (agent) res.json({ project, agent, entries: readBuilderLog(String(project), String(agent), { sinceHours, limit }) })
      else res.json({ project, entries_by_agent: readAllBuilderLogs(String(project), { sinceHours, limitPerAgent: limit }) })
    } catch (e) {
      res.status(400).json({ error: e?.message || String(e) })
    }
  })

  r.get('/health', (_req, res) => {
    res.json({ ok: true, anthropic: hasAnthropic(), projects: listProjects() })
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
