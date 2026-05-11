import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import matter from 'gray-matter'

const REPO_ROOT = resolve(__dirname, '..')
const PROJECTS_DIR = join(REPO_ROOT, 'projects')
const REVIEWS_DIR = join(REPO_ROOT, 'reviews')

type State = 'new-idea' | 'draft' | 'bank' | 'published'

function listProjects(): string[] {
  if (!existsSync(PROJECTS_DIR)) return []
  return readdirSync(PROJECTS_DIR).filter(n => {
    if (n.startsWith('_') || n.startsWith('.')) return false
    const p = join(PROJECTS_DIR, n)
    return statSync(p).isDirectory() && existsSync(join(p, 'project.yaml'))
  }).sort()
}

function listAgents(project: string): string[] {
  const dir = join(PROJECTS_DIR, project, 'agents')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(n => {
    const p = join(dir, n)
    return statSync(p).isDirectory() && existsSync(join(p, 'agent.yaml'))
  }).sort()
}

function walkAgentState(project: string, agent: string, state: State) {
  const dir = join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', state)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => {
      const path = join(dir, f)
      const stat = statSync(path)
      const raw = readFileSync(path, 'utf-8')
      let data: Record<string, unknown> = {}
      let body = raw
      try { const parsed = matter(raw); data = parsed.data; body = parsed.content }
      catch { /* ignore parse errors */ }
      return {
        id: f.replace(/\.md$/, ''),
        project,
        agent,
        state,
        file: relative(REPO_ROOT, path),
        size: stat.size,
        mtime: stat.mtimeMs,
        frontmatter: data,
        preview: body.trim().split('\n').slice(0, 6).join('\n').slice(0, 400),
      }
    })
}

function collect(opts: { project?: string; state?: State; agent?: string }) {
  const projects = opts.project ? [opts.project] : listProjects()
  const states: State[] = opts.state ? [opts.state] : ['new-idea', 'draft', 'bank', 'published']
  const out = []
  for (const p of projects) {
    const agents = opts.agent ? [opts.agent] : listAgents(p)
    for (const a of agents) for (const s of states) out.push(...walkAgentState(p, a, s))
  }
  return out.sort((a, b) => b.mtime - a.mtime)
}

function countsFor(project?: string) {
  return {
    'new-idea': collect({ project, state: 'new-idea' }).length,
    'draft': collect({ project, state: 'draft' }).length,
    'bank': collect({ project, state: 'bank' }).length,
    'published': collect({ project, state: 'published' }).length,
  }
}

function reviewerQueueCount() {
  if (!existsSync(REVIEWS_DIR)) return {}
  const out: Record<string, number> = {}
  for (const name of readdirSync(REVIEWS_DIR)) {
    const p = join(REVIEWS_DIR, name)
    if (!statSync(p).isDirectory()) continue
    out[name] = readdirSync(p).filter(f => f.endsWith('.md') && f !== '.gitkeep').length
  }
  return out
}

function readRegistry() {
  const f = join(PROJECTS_DIR, '_registry.json')
  if (!existsSync(f)) return null
  try { return JSON.parse(readFileSync(f, 'utf-8')) } catch { return null }
}

function gtmSwarmApi(): Plugin {
  return {
    name: 'gtm-swarm-api',
    configureServer(server) {
      server.middlewares.use('/api/projects', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ registry: readRegistry(), discovered: listProjects() }))
      })

      server.middlewares.use('/api/content', (req, res) => {
        const url = new URL(req.url || '', 'http://x')
        const project = url.searchParams.get('project') || undefined
        const state = (url.searchParams.get('state') || undefined) as State | undefined
        const agent = url.searchParams.get('agent') || undefined
        const items = collect({ project, state, agent })
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          items,
          counts: countsFor(project),
          reviewers: reviewerQueueCount(),
          project: project || null,
        }))
      })

      server.middlewares.use('/api/file', (req, res) => {
        const url = new URL(req.url || '', 'http://x')
        const rel = url.searchParams.get('path') || ''
        const abs = resolve(REPO_ROOT, rel)
        if (!abs.startsWith(REPO_ROOT) || !existsSync(abs)) {
          res.statusCode = 404; res.end('not found'); return
        }
        const raw = readFileSync(abs, 'utf-8')
        let data: Record<string, unknown> = {}; let body = raw
        try { const parsed = matter(raw); data = parsed.data; body = parsed.content } catch {}
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ frontmatter: data, body, file: rel }))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), gtmSwarmApi()],
  server: {
    port: 8082,
    strictPort: true,
    host: '127.0.0.1',
  },
})
