import cron from 'node-cron'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { PROJECTS_DIR } from './paths.js'
import { sourceIdeas } from './source-ideas.js'
import { hasAnthropic } from './llm.js'

const SCHEDULE = process.env.GTM_IDEAS_CRON || '0 8 * * *'  // daily 08:00 UTC
const IDEAS_PER_AGENT = parseInt(process.env.GTM_IDEAS_PER_AGENT || '5', 10)
const ENABLED = process.env.GTM_CRON_ENABLED !== 'false'

function builtProjects() {
  if (!existsSync(PROJECTS_DIR)) return []
  return readdirSync(PROJECTS_DIR)
    .filter(n => !n.startsWith('_') && !n.startsWith('.'))
    .filter(n => {
      const f = path.join(PROJECTS_DIR, n, '.contentos-state.json')
      if (!existsSync(f)) return false
      try {
        const s = JSON.parse(readFileSync(f, 'utf-8'))
        return s?.steps?.['04-content-strategy']?.status === 'done'
      } catch { return false }
    })
}

async function runDailyIdeas() {
  const ts = new Date().toISOString()
  console.log(`[cron ${ts}] daily Ideas Pool refresh begin`)
  if (!hasAnthropic()) {
    console.log(`[cron] skipped — ANTHROPIC_API_KEY not set`)
    return
  }
  const slugs = builtProjects()
  if (!slugs.length) {
    console.log(`[cron] no built projects`)
    return
  }
  for (const slug of slugs) {
    try {
      const out = await sourceIdeas({ project: slug, n: IDEAS_PER_AGENT })
      console.log(`[cron] ${slug}: +${out.total} ideas (${out.log.join(' / ')})`)
    } catch (e) {
      console.error(`[cron] ${slug} failed:`, e?.message || e)
    }
  }
  console.log(`[cron ${new Date().toISOString()}] daily Ideas Pool refresh end`)
}

export function startCron() {
  if (!ENABLED) {
    console.log(`[cron] disabled via GTM_CRON_ENABLED=false`)
    return
  }
  if (!cron.validate(SCHEDULE)) {
    console.error(`[cron] invalid schedule: ${SCHEDULE}`)
    return
  }
  cron.schedule(SCHEDULE, () => { runDailyIdeas().catch(e => console.error('[cron] uncaught:', e)) }, { timezone: 'UTC' })
  console.log(`[cron] scheduled: ${SCHEDULE} UTC · IDEAS_PER_AGENT=${IDEAS_PER_AGENT}`)
}

export { runDailyIdeas }
