import { NextRequest, NextResponse } from 'next/server'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { hasMultica } from '@/server/multica-db.js'

export async function GET(request: NextRequest) {
  const project = request.nextUrl.searchParams.get('project') || ''
  if (!project) return NextResponse.json({ error: 'project required' }, { status: 400 })

  if (hasMultica()) {
    const { getWorkspaceAgents } = await import('@/server/multica-db.js')
    const agents = await getWorkspaceAgents('GTM')
    return NextResponse.json({ project, agents })
  }

  if (hasDB()) {
    const ws = await store.getWorkspace(project)
    if (!ws) return NextResponse.json({ error: 'workspace not found' }, { status: 404 })
    const agents = await store.listAgentsForWorkspace(ws.id)
    return NextResponse.json({ project, agents })
  }

  return NextResponse.json({ error: 'no database configured' }, { status: 503 })
}
