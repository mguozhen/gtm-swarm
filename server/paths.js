import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(__dirname, '..')
export const PROJECTS_DIR = path.join(REPO_ROOT, 'projects')
export const REVIEWS_DIR = path.join(REPO_ROOT, 'reviews')
export const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates', 'contentos-agent')
