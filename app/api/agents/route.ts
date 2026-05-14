import { NextRequest, NextResponse } from 'next/server'
import { hasMultica } from '@/server/multica-db.js'

export async function GET(request: NextRequest) {
  const project = request.nextUrl.searchParams.get('project') || ''
  if (!project) return NextResponse.json({ error: 'project required' }, { status: 400 })

  if (!hasMultica()) return NextResponse.json({ error: 'multica not configured' }, { status: 503 })

  const { getWorkspaceAgents } = await import('@/server/multica-db.js')
  let agents = await getWorkspaceAgents(project)
  if (agents.length === 0) agents = await getWorkspaceAgents('gtm')
  return NextResponse.json({ project, agents })
}
