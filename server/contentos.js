import path from 'node:path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import yaml from 'js-yaml'
import { complete } from './llm.js'
import { REPO_ROOT, PROJECTS_DIR, TEMPLATES_DIR } from './paths.js'

const STEPS = [
  { n: 1, slug: '01-market-insight', label: 'Market Insight', deps: [] },
  { n: 2, slug: '02-user-insight', label: 'User Insight', deps: ['01-market-insight'] },
  { n: 3, slug: '03-competitor-analysis', label: 'Competitor Analysis', deps: ['01-market-insight', '02-user-insight'] },
  { n: 4, slug: '04-content-strategy', label: 'Content Strategy', deps: ['01-market-insight', '02-user-insight', '03-competitor-analysis'] },
]

function loadState(projectDir) {
  const f = path.join(projectDir, '.contentos-state.json')
  if (!existsSync(f)) {
    return { current_step: 0, steps: Object.fromEntries(STEPS.map(s => [s.slug, { status: 'pending' }])) }
  }
  return JSON.parse(readFileSync(f, 'utf-8'))
}

function saveState(projectDir, state) {
  state.last_updated = new Date().toISOString()
  writeFileSync(path.join(projectDir, '.contentos-state.json'), JSON.stringify(state, null, 2))
}

function readCiaData(projectDir) {
  // CIA integration: if `projects/<slug>/cia/synthesis.md` exists (produced
  // by running `cia init/fetch-*/export` locally), include it as primary
  // grounded-data source for Steps 1+2. Falls through silently if absent.
  const ciaDir = path.join(projectDir, 'cia')
  if (!existsSync(ciaDir)) return null
  const out = []
  const synth = path.join(ciaDir, 'synthesis.md')
  if (existsSync(synth)) {
    out.push(`### CIA synthesis.md (赛道矩阵 + TAM 估算)\n\n${readFileSync(synth, 'utf-8')}`)
  }
  // Also surface report.md if present (richer prose form)
  const report = path.join(ciaDir, 'report.md')
  if (existsSync(report) && !existsSync(synth)) {
    out.push(`### CIA report.md\n\n${readFileSync(report, 'utf-8')}`)
  }
  return out.length ? out.join('\n\n') : null
}

export function buildPrompt(stepIdx, projectDir, projectYaml) {
  const step = STEPS[stepIdx]
  const template = readFileSync(path.join(TEMPLATES_DIR, `${step.slug}.md`), 'utf-8')
  const parts = [`## ContentOS Agent — Running Step ${step.n}: ${step.label}\n`]
  parts.push('## PROJECT YAML\n')
  parts.push('```yaml\n' + yaml.dump(projectYaml, { sortKeys: false }) + '```\n')

  // CIA real-data injection (Steps 1 + 2 benefit most; 3+4 inherit via prior outputs)
  if (step.n <= 2) {
    const cia = readCiaData(projectDir)
    if (cia) {
      parts.push('## 🕵️ CIA REAL DATA (Chief Intelligence Officer pipeline)\n')
      parts.push('Below is real market data from Ahrefs / DataForSEO / Apify (TikTok+Reddit) / iTunes / YouTube via the CIA skill. **Treat this as primary source for TAM/SAM math, competitor counts, keyword volumes, and pain-point quantification.** Do not invent numbers — cite from CIA tables where possible.\n')
      parts.push(cia)
      parts.push('\n')
    }
  }

  for (const depSlug of step.deps) {
    const depFile = path.join(projectDir, 'strategy', `${depSlug}.md`)
    if (existsSync(depFile)) {
      parts.push(`## PRIOR OUTPUT — ${depSlug}.md\n`)
      parts.push(readFileSync(depFile, 'utf-8'))
      parts.push('\n')
    } else {
      throw new Error(`Dependency missing: ${depFile}`)
    }
  }
  parts.push('## INSTRUCTION TEMPLATE\n')
  parts.push(template)
  parts.push(`\n\nNow produce the output for Step ${step.n} (${step.label}). Output ONLY the markdown brief (and, for Step 4, the AGENT-HYDRATION block at the end). No preamble.`)
  return parts.join('\n')
}

export async function runContentOSStep(slug, n) {
  if (n < 1 || n > 4) throw new Error('step must be 1..4')
  const projectDir = path.join(PROJECTS_DIR, slug)
  if (!existsSync(projectDir)) throw new Error(`project not found: ${slug}`)
  const projectYamlPath = path.join(projectDir, 'project.yaml')
  const projectYaml = yaml.load(readFileSync(projectYamlPath, 'utf-8')) || {}

  const step = STEPS[n - 1]
  const state = loadState(projectDir)
  state.steps[step.slug] = { status: 'running', started_at: new Date().toISOString() }
  saveState(projectDir, state)

  const prompt = buildPrompt(n - 1, projectDir, projectYaml)
  const { text, usage } = await complete(prompt, { maxTokens: 20000 })

  const strategyDir = path.join(projectDir, 'strategy')
  mkdirSync(strategyDir, { recursive: true })
  const outFile = path.join(strategyDir, `${step.slug}.md`)
  writeFileSync(outFile, text)

  state.steps[step.slug] = {
    ...state.steps[step.slug],
    status: 'done',
    output_file: path.relative(REPO_ROOT, outFile),
    completed_at: new Date().toISOString(),
    size: text.length,
    usage,
  }
  state.current_step = n
  saveState(projectDir, state)

  projectYaml.contentos_agent = projectYaml.contentos_agent || {}
  projectYaml.contentos_agent.state = n < 4 ? `step_${n}_done` : 'step_4_done'
  projectYaml.contentos_agent.last_run = new Date().toISOString()
  writeFileSync(projectYamlPath, yaml.dump(projectYaml, { lineWidth: 0, sortKeys: false }))

  return { step: n, file: path.relative(REPO_ROOT, outFile), size: text.length }
}

export function hydrateAgents(slug) {
  const projectDir = path.join(PROJECTS_DIR, slug)
  if (!existsSync(projectDir)) throw new Error(`project not found: ${slug}`)
  const strategyMd = path.join(projectDir, 'strategy', '04-content-strategy.md')
  if (!existsSync(strategyMd)) throw new Error('step 4 not done')
  const text = readFileSync(strategyMd, 'utf-8')
  const m = text.match(/---AGENT-HYDRATION-START---\s*\n([\s\S]*?)\n---AGENT-HYDRATION-END---/)
  if (!m) throw new Error('AGENT-HYDRATION block not found')
  let block = m[1].trim()
  block = block.replace(/^```ya?ml\s*\n/, '').replace(/\n```\s*$/, '')
  const parsed = yaml.load(block)
  if (!parsed?.agents) throw new Error('bad hydration block')
  const agentsDir = path.join(projectDir, 'agents')
  const updated = []; const skipped = []
  for (const [aid, fields] of Object.entries(parsed.agents)) {
    const yp = path.join(agentsDir, aid, 'agent.yaml')
    if (!existsSync(yp)) { skipped.push(aid); continue }
    const existing = yaml.load(readFileSync(yp, 'utf-8')) || {}
    const merged = { ...existing }
    for (const f of ['activate', 'goal', 'kpi', 'topics']) {
      if (f in fields) merged[f] = fields[f]
    }
    merged.contentos_hydrated_at = new Date().toISOString()
    if (fields.activate === false) merged.status = 'deactivated_by_contentos'
    else if (merged.status === 'deactivated_by_contentos') merged.status = 'active'
    writeFileSync(yp, yaml.dump(merged, { lineWidth: 0, sortKeys: false }))
    updated.push(aid)
  }
  const py = yaml.load(readFileSync(path.join(projectDir, 'project.yaml'), 'utf-8'))
  py.contentos_agent = { ...(py.contentos_agent || {}), state: 'built', built_at: new Date().toISOString(), agents_hydrated: updated.length }
  writeFileSync(path.join(projectDir, 'project.yaml'), yaml.dump(py, { lineWidth: 0, sortKeys: false }))
  return { updated, skipped }
}
