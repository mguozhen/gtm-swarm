// server/cia.js
// CIA-insight integration — spawns Python CLI, synthesizes results into project.yaml
import { spawn } from 'node:child_process'
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { complete } from './llm.js'
import { PROJECTS_DIR } from './paths.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CIA_SCRIPTS = path.join(__dirname, '../tools/cia-insight/scripts')
const CIA_HUB_URL = 'https://cia.ericstory.me'
const REPORTS_BASE = path.join(process.env.HOME, 'workspace/analytics/reports')

// In-memory status store: slug → { phase, log, done, error }
const statusStore = new Map()

export function getCIAStatus(slug) {
  return statusStore.get(slug) || null
}

function setStatus(slug, patch) {
  const prev = statusStore.get(slug) || { phase: 'idle', log: [], done: false }
  statusStore.set(slug, { ...prev, ...patch })
}

function log(slug, msg) {
  const s = statusStore.get(slug) || { phase: 'idle', log: [], done: false }
  s.log.push(msg)
  if (s.log.length > 100) s.log.shift()
  statusStore.set(slug, s)
  console.log(`[CIA:${slug}] ${msg}`)
}

function cli(slug, args) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      CIA_HUB_URL,
      CIA_HUB_TOKEN: process.env.CIA_HUB_TOKEN,
      PYTHONPATH: CIA_SCRIPTS,
    }
    const child = spawn('python3', [path.join(CIA_SCRIPTS, 'cli.py'), ...args], {
      env, cwd: CIA_SCRIPTS,
    })
    let out = ''
    child.stdout.on('data', d => { out += d; log(slug, d.toString().trim()) })
    child.stderr.on('data', d => log(slug, `stderr: ${d.toString().trim()}`))
    child.on('close', code => {
      if (code !== 0) reject(new Error(`cli.py ${args[0]} exit ${code}`))
      else resolve(out)
    })
  })
}

function findTopicDir(topic) {
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!existsSync(REPORTS_BASE)) return null
  const dirs = readdirSync(REPORTS_BASE)
    .filter(d => d.endsWith(`-cia-${slug}`))
    .sort().reverse()
  return dirs.length ? path.join(REPORTS_BASE, dirs[0]) : null
}

async function synthesizeWithLLM(slug, topic, topicDir) {
  // Read CIA sqlite DB using Python to dump tables as JSON
  const dumpScript = `
import sys, json, sqlite3, os
db_path = sys.argv[1]
con = sqlite3.connect(db_path)
con.row_factory = sqlite3.Row
out = {}
for table in ['seeds', 'competitors_app', 'competitors_web', 'competitor_clusters', 'social_reddit', 'social_tiktok', 'social_youtube']:
    try:
        rows = con.execute(f'SELECT * FROM {table} LIMIT 50').fetchall()
        out[table] = [dict(r) for r in rows]
    except: pass
print(json.dumps(out))
`
  const dbPath = path.join(topicDir, 'cia.db')
  if (!existsSync(dbPath)) throw new Error('cia.db not found — pipeline may not have run')

  const data = await new Promise((resolve, reject) => {
    const child = spawn('python3', ['-c', dumpScript, dbPath])
    let out = ''
    child.stdout.on('data', d => { out += d })
    child.stderr.on('data', () => {})
    child.on('close', code => code === 0 ? resolve(out) : reject(new Error('dump failed')))
  })

  const parsed = JSON.parse(data)

  const competitors = [
    ...(parsed.competitors_app || []).slice(0, 20).map(r => r.name || r.title || r.app_id),
    ...(parsed.competitors_web || []).slice(0, 10).map(r => r.domain || r.name),
  ].filter(Boolean).slice(0, 10)

  const socialSamples = [
    ...(parsed.social_reddit || []).slice(0, 5).map(r => r.title || r.body || ''),
    ...(parsed.social_tiktok || []).slice(0, 5).map(r => r.desc || r.title || ''),
  ].filter(Boolean).join('\n')

  const prompt = `You are a GTM strategist. Based on market research data for the topic "${topic}", extract structured product information.

COMPETITORS FOUND: ${competitors.join(', ')}

SOCIAL SIGNALS (Reddit/TikTok posts about this topic):
${socialSamples.slice(0, 2000)}

Output ONLY valid JSON (no markdown):
{
  "tagline": "One sharp sentence: what the product does and for whom",
  "category": "B2B SaaS | B2C App | Dev Tools | AI Tool | etc",
  "audience": {
    "primary": "specific user persona (role + context)",
    "secondary": "secondary segment"
  },
  "positioning": "1-2 sentences: what makes this different from competitors",
  "competitors": ["top 5 competitor names from the list above"],
  "suggested_channels": ["reddit", "x", "blog", "kol-koc", "video"]
}`

  const { text } = await complete(prompt, { maxTokens: 1000 })
  const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(clean)
}

export async function runCIAAnalysis(productName, slug) {
  if (!process.env.CIA_HUB_TOKEN) throw new Error('CIA_HUB_TOKEN not configured')
  const topic = productName  // use product name as CIA topic

  setStatus(slug, { phase: 'starting', log: [], done: false, error: null })

  // Run pipeline in background
  ;(async () => {
    try {
      log(slug, `▶ init topic="${topic}"`)
      setStatus(slug, { phase: 'init' })
      await cli(slug, ['init', topic, '--country', 'us'])

      log(slug, '▶ fetch-reddit')
      setStatus(slug, { phase: 'fetch-reddit' })
      await cli(slug, ['fetch-reddit', '--topic', topic])

      log(slug, '▶ fetch-tiktok')
      setStatus(slug, { phase: 'fetch-tiktok' })
      await cli(slug, ['fetch-tiktok', '--topic', topic])

      log(slug, '▶ discover-loop (1 round)')
      setStatus(slug, { phase: 'discover' })
      await cli(slug, ['discover-loop', '--topic', topic, '--max-rounds', '1', '--budget', '2.0'])

      log(slug, '▶ cluster-competitors')
      setStatus(slug, { phase: 'cluster' })
      await cli(slug, ['cluster-competitors', '--topic', topic])

      log(slug, '▶ propose-tracks')
      setStatus(slug, { phase: 'tracks' })
      await cli(slug, ['propose-tracks', '--topic', topic, '--n', '4'])

      log(slug, '▶ apply-tracks')
      await cli(slug, ['apply-tracks', '--topic', topic])

      log(slug, '▶ synthesizing with LLM...')
      setStatus(slug, { phase: 'synthesize' })
      const topicDir = findTopicDir(topic)
      if (!topicDir) throw new Error('topic dir not found after pipeline')

      const synthesis = await synthesizeWithLLM(slug, topic, topicDir)

      // Update project.yaml
      const projPath = path.join(PROJECTS_DIR, slug, 'project.yaml')
      if (existsSync(projPath)) {
        const current = yaml.load(readFileSync(projPath, 'utf-8')) || {}
        const updated = { ...current, ...synthesis, cia_analyzed_at: new Date().toISOString() }
        writeFileSync(projPath, yaml.dump(updated, { lineWidth: 0, sortKeys: false }))
        log(slug, '✓ project.yaml updated')
      }

      setStatus(slug, { phase: 'done', done: true })
      log(slug, '✓ CIA analysis complete')
    } catch (e) {
      log(slug, `✗ error: ${e.message}`)
      setStatus(slug, { phase: 'error', done: true, error: e.message })
    }
  })()

  return { started: true, topic, slug }
}
