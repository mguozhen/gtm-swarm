import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { PROJECTS_DIR } from '@/lib/fs-api'

export async function GET(request: NextRequest) {
  const project = request.nextUrl.searchParams.get('project') || ''
  const agentsDir = path.join(PROJECTS_DIR, project, 'agents')
  if (!project || !existsSync(agentsDir)) {
    return NextResponse.json({ error: 'project agents dir not found' }, { status: 404 })
  }
  const out = readdirSync(agentsDir)
    .filter(n => existsSync(path.join(agentsDir, n, 'agent.yaml')))
    .sort()
    .map(id => {
      const raw = readFileSync(path.join(agentsDir, id, 'agent.yaml'), 'utf-8')
      let yaml: Record<string, unknown> = {}
      try { yaml = (matter('---\n' + raw + '\n---\n').data) as Record<string, unknown> } catch {}
      const metricsPath = path.join(agentsDir, id, 'metrics.json')
      let metrics: Record<string, unknown> = {}
      if (existsSync(metricsPath)) {
        try { metrics = JSON.parse(readFileSync(metricsPath, 'utf-8')) } catch {}
      }
      return { id, yaml, metrics }
    })
  return NextResponse.json({ project, agents: out })
}
