import path from 'node:path'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import yaml from 'js-yaml'
import matter from 'gray-matter'
import { complete } from './llm.js'
import { REPO_ROOT, PROJECTS_DIR } from './paths.js'

const IDEA_SEPARATOR = '---IDEA---'

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'idea'
}

function loadRecent(agentDir, limit = 5) {
  const parts = []
  for (const state of ['bank', 'published']) {
    const d = path.join(agentDir, 'content-bank', state)
    if (!existsSync(d)) continue
    const files = readdirSync(d)
      .filter(f => f.endsWith('.md') && f !== '.gitkeep')
      .map(f => ({ f, p: path.join(d, f), m: statSync(path.join(d, f)).mtimeMs }))
      .sort((a, b) => b.m - a.m).slice(0, limit)
    for (const x of files) {
      try {
        const topic = matter(readFileSync(x.p, 'utf-8')).data.topic
        if (topic) parts.push(`  · (${state}) ${topic}`)
      } catch {}
    }
  }
  return parts.length ? parts.join('\n') : '  · (none yet)'
}

function loadAntiPatterns(agentDir) {
  const f = path.join(agentDir, 'anti-patterns.md')
  if (!existsSync(f)) return ''
  const text = readFileSync(f, 'utf-8')
  if (text.includes('(none yet)')) return ''
  return text.slice(-2000)
}

function buildPrompt(projectYaml, briefs, hooks, agentYaml, recent, anti, n, now) {
  const audience = projectYaml.audience || {}
  const audienceStr = `primary=${audience.primary || ''}; secondary=${audience.secondary || ''}`
  const parts = [
    `You are the ${projectYaml.name || 'project'} GTM idea-generation agent for ${agentYaml.id} (${agentYaml.platform || ''}).`,
    '',
    `AGENT GOAL: ${agentYaml.goal || ''}`,
    '',
    'PROJECT CONTEXT:',
    yaml.dump({
      name: projectYaml.name, url: projectYaml.url, category: projectYaml.category,
      tagline: projectYaml.tagline, audience, positioning: projectYaml.positioning,
    }, { sortKeys: false }),
  ]
  if (briefs.length) {
    parts.push('\n## STRATEGY BRIEFS (Step 1-4 condensed)')
    briefs.forEach((b, i) => parts.push(`\n### Brief ${i + 1} (first 2000 chars):\n${b.slice(0, 2000)}`))
  }
  if (hooks) parts.push(`\n## HOOK FORMULAS (first 1500 chars):\n${hooks.slice(0, 1500)}`)
  if (agentYaml.topics?.length) {
    parts.push('\n## AGENT TOPIC TERRITORIES (must align):')
    for (const t of agentYaml.topics) parts.push(`  · ${t}`)
  }
  parts.push('\n## RECENT OUTPUTS (avoid direct repetition):')
  parts.push(recent)
  if (anti) {
    parts.push('\n## ANTI-PATTERNS (do NOT generate these shapes):')
    parts.push(anti)
  }
  parts.push(`
## YOUR TASK
Produce **${n} fresh content ideas** for ${agentYaml.id}. Each idea must:
- Match the agent's platform (${agentYaml.platform || ''}) and the project's positioning
- Use one of the hook categories
- Address the audience: ${audienceStr}
- Be DIFFERENT from the recent outputs above (no near-duplicates)
- NOT match any anti-pattern

For EACH idea output exactly this block, separated by \`${IDEA_SEPARATOR}\`:

${IDEA_SEPARATOR}
---
project: ${projectYaml.slug}
agent: ${agentYaml.id}
source: contentos-daily
topic: "<one-sentence concrete topic>"
suggested_hook: <data-bomb | competitor-intel | contrarian | curiosity-gap | direct-challenge | result-first | speed-ease>
target_audience: <builders | casual | mixed>
freshness_days: 7
created_at: ${now}
status: new-idea
---
**Rationale**: <1-2 sentences why this idea fits the agent + why now>

**Angle**: <1 sentence specific angle that makes this idea concrete>

**Hook seed (first line)**: <a draft of the opening hook line>

Output ONLY the ${IDEA_SEPARATOR} blocks, exactly ${n} of them. No preamble.`)
  return parts.join('\n')
}

export async function sourceIdeas({ project, agent, n = 5 }) {
  const projectDir = path.join(PROJECTS_DIR, project)
  if (!existsSync(projectDir)) throw new Error(`project not found: ${project}`)
  const projectYaml = yaml.load(readFileSync(path.join(projectDir, 'project.yaml'), 'utf-8')) || {}
  projectYaml.slug = projectYaml.slug || project

  const briefs = []
  for (const step of ['01-market-insight', '02-user-insight', '03-competitor-analysis', '04-content-strategy']) {
    const f = path.join(projectDir, 'strategy', `${step}.md`)
    if (existsSync(f)) briefs.push(readFileSync(f, 'utf-8'))
  }

  const hooksPath = path.join(projectDir, 'engine', 'engine', 'hooks.md')
  const hooks = existsSync(hooksPath) ? readFileSync(hooksPath, 'utf-8') : ''

  const agentsDir = path.join(projectDir, 'agents')
  const agentIds = agent ? [agent] : readdirSync(agentsDir).filter(d => existsSync(path.join(agentsDir, d, 'agent.yaml'))).sort()

  let total = 0
  const log = []
  for (const aid of agentIds) {
    const agentDir = path.join(agentsDir, aid)
    const agentYaml = yaml.load(readFileSync(path.join(agentDir, 'agent.yaml'), 'utf-8')) || {}
    if (agentYaml.activate === false) { log.push(`${aid}: skip (deactivated)`); continue }
    if (!agentYaml.topics?.length) { log.push(`${aid}: skip (no topics)`); continue }
    agentYaml.id = aid

    const recent = loadRecent(agentDir)
    const anti = loadAntiPatterns(agentDir)
    const prompt = buildPrompt(projectYaml, briefs, hooks, agentYaml, recent, anti, n, new Date().toISOString())
    const { text } = await complete(prompt, { maxTokens: 16000 })

    const blocks = text.split(IDEA_SEPARATOR).map(s => s.trim()).filter(Boolean)
    const newIdeaDir = path.join(agentDir, 'content-bank', 'new-idea')
    mkdirSync(newIdeaDir, { recursive: true })
    let written = 0
    const ts = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    for (const b of blocks) {
      try {
        const parsed = matter(b)
        const topic = parsed.data.topic || 'untitled'
        const f = path.join(newIdeaDir, `${ts}-${slugify(topic)}.md`)
        writeFileSync(f, matter.stringify(parsed.content, parsed.data))
        written++
      } catch (e) { console.warn('skip malformed:', e?.message) }
    }
    total += written
    log.push(`${aid}: +${written} ideas`)
  }
  return { project, total, log }
}
