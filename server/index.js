import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { mountApi, REPO_ROOT } from './api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json({ limit: '5mb' }))

app.use((req, _res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  }
  next()
})

mountApi(app)

const DIST = path.join(REPO_ROOT, 'dashboard', 'dist')
if (existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(DIST, 'index.html'))
  })
} else {
  console.warn(`⚠ dashboard/dist not found at ${DIST} — run pnpm build first`)
}

const PORT = process.env.PORT || 8082
app.listen(PORT, () => {
  console.log(`gtm-swarm listening on :${PORT}`)
  console.log(`REPO_ROOT = ${REPO_ROOT}`)
  console.log(`anthropic key set: ${Boolean(process.env.ANTHROPIC_API_KEY)}`)
})
