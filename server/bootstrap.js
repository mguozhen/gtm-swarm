import path from 'node:path'
import { existsSync, mkdirSync, readdirSync, cpSync } from 'node:fs'
import { PROJECTS_DIR, REVIEWS_DIR, BOOTSTRAP_FROM, REPO_ROOT } from './paths.js'

// On first boot with GTM_DATA_DIR set (Railway volume), copy the committed
// projects/ baseline into the volume so the dashboard isn't empty.
// Subsequent boots see the existing volume and skip.
export function bootstrap() {
  if (PROJECTS_DIR === BOOTSTRAP_FROM) {
    console.log(`[bootstrap] no GTM_DATA_DIR → in-place projects/`)
    return
  }
  mkdirSync(path.dirname(PROJECTS_DIR), { recursive: true })
  if (!existsSync(PROJECTS_DIR) || readdirSync(PROJECTS_DIR).length === 0) {
    console.log(`[bootstrap] seeding ${PROJECTS_DIR} from ${BOOTSTRAP_FROM}`)
    cpSync(BOOTSTRAP_FROM, PROJECTS_DIR, { recursive: true })
  } else {
    console.log(`[bootstrap] ${PROJECTS_DIR} already populated`)
  }
  mkdirSync(REVIEWS_DIR, { recursive: true })
  console.log(`[bootstrap] PROJECTS_DIR = ${PROJECTS_DIR}`)
  console.log(`[bootstrap] REVIEWS_DIR  = ${REVIEWS_DIR}`)
}
