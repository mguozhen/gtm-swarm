import { NextResponse } from 'next/server'
import { hasDB } from '@/server/db.js'
import { hasMultica } from '@/server/multica-db.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function GET() {
  const result: Record<string, unknown> = {
    hasDB: hasDB(),
    hasMultica: hasMultica(),
  }

  if (hasMultica()) {
    try {
      const { listAllWorkspaces, getWorkspaceAgents } = await import('@/server/multica-db.js')
      result.multica_workspaces = await listAllWorkspaces()
      result.gtm_agents = await getWorkspaceAgents(MULTICA_WORKSPACE_SLUG)
    } catch (e: unknown) {
      result.multica_error = (e as Error).message
    }
  }

  if (hasDB()) {
    try {
      const store = await import('@/server/store.js')
      result.gtm_workspaces = await store.listWorkspaces()
    } catch (e: unknown) {
      result.gtm_db_error = (e as Error).message
    }
  }

  return NextResponse.json(result)
}
