import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
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

      // ContentOS Agent endpoints
      server.middlewares.use('/api/contentos', async (req, res) => {
        const url = new URL(req.url || '', 'http://x')
        const m = url.pathname.match(/^\/([^/]+)\/(state|run-step|save-edit|build|strategy)/)
        if (!m) { res.statusCode = 404; res.end('not found'); return }
        const [, slug, action] = m
        const projectDir = join(PROJECTS_DIR, slug)
        if (!existsSync(projectDir)) {
          res.statusCode = 404; res.end(JSON.stringify({ error: 'project not found' })); return
        }
        res.setHeader('Content-Type', 'application/json')

        if (action === 'state' && req.method === 'GET') {
          const stateFile = join(projectDir, '.contentos-state.json')
          const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf-8'))
            : { current_step: 0, steps: {} }
          const project = existsSync(join(projectDir, 'project.yaml'))
            ? readFileSync(join(projectDir, 'project.yaml'), 'utf-8') : ''
          res.end(JSON.stringify({ slug, state, project_yaml: project }))
          return
        }

        if (action === 'strategy' && req.method === 'GET') {
          const step = url.searchParams.get('step')
          if (!step) { res.statusCode = 400; res.end(JSON.stringify({ error: 'step required' })); return }
          const slugMap: Record<string, string> = {
            '1': '01-market-insight', '2': '02-user-insight',
            '3': '03-competitor-analysis', '4': '04-content-strategy',
          }
          const fname = slugMap[step]
          if (!fname) { res.statusCode = 400; res.end(JSON.stringify({ error: 'bad step' })); return }
          const f = join(projectDir, 'strategy', `${fname}.md`)
          const exists = existsSync(f)
          res.end(JSON.stringify({
            step, file: relative(REPO_ROOT, f), exists,
            content: exists ? readFileSync(f, 'utf-8') : '',
          }))
          return
        }

        if (action === 'run-step' && req.method === 'POST') {
          const step = url.searchParams.get('step')
          if (!step || !['1','2','3','4'].includes(step)) {
            res.statusCode = 400; res.end(JSON.stringify({ error: 'step 1..4 required' })); return
          }
          const child = spawn('python3',
            [join(REPO_ROOT, 'scripts/contentos-agent.py'), '--project', slug, '--step', step],
            { cwd: REPO_ROOT, env: process.env })
          let out = '', err = ''
          child.stdout.on('data', d => out += d.toString())
          child.stderr.on('data', d => err += d.toString())
          child.on('close', code => {
            res.statusCode = code === 0 ? 200 : 500
            res.end(JSON.stringify({ code, stdout: out, stderr: err }))
          })
          req.on('close', () => child.kill('SIGTERM'))
          return
        }

        if (action === 'save-edit' && req.method === 'POST') {
          const step = url.searchParams.get('step')
          const slugMap: Record<string, string> = {
            '1': '01-market-insight', '2': '02-user-insight',
            '3': '03-competitor-analysis', '4': '04-content-strategy',
          }
          if (!step || !slugMap[step]) {
            res.statusCode = 400; res.end(JSON.stringify({ error: 'bad step' })); return
          }
          let body = ''
          req.on('data', c => body += c.toString())
          req.on('end', () => {
            try {
              const payload = JSON.parse(body)
              const f = join(projectDir, 'strategy', `${slugMap[step]}.md`)
              writeFileSync(f, payload.content)
              res.end(JSON.stringify({ ok: true, file: relative(REPO_ROOT, f), size: payload.content.length }))
            } catch (e: unknown) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: String(e) }))
            }
          })
          return
        }

        if (action === 'build' && req.method === 'POST') {
          const child = spawn('python3',
            [join(REPO_ROOT, 'scripts/hydrate-agents.py'), '--project', slug],
            { cwd: REPO_ROOT, env: process.env })
          let out = '', err = ''
          child.stdout.on('data', d => out += d.toString())
          child.stderr.on('data', d => err += d.toString())
          child.on('close', code => {
            res.statusCode = code === 0 ? 200 : 500
            res.end(JSON.stringify({ code, stdout: out, stderr: err }))
          })
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'method not allowed' }))
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
