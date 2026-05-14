import { NextRequest, NextResponse } from 'next/server'
import { hasMultica } from '@/server/multica-db.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const project = request.nextUrl.searchParams.get('project') || ''
  if (!project) return NextResponse.json({ error: 'project required' }, { status: 400 })

  if (!hasMultica()) return NextResponse.json({ error: 'multica not configured' }, { status: 503 })

  const { getWorkspaceAgents } = await import('@/server/multica-db.js')
  const agents = await getWorkspaceAgents(MULTICA_WORKSPACE_SLUG)
  return NextResponse.json({ project, agents })
}
