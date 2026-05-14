import { NextRequest, NextResponse } from 'next/server'
import { collect, countsFor, reviewerQueueCount, type State } from '@/lib/fs-api'
import { hasMultica } from '@/server/multica-db.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const project = p.get('project') || undefined
  const state = (p.get('state') || undefined) as State | undefined
  const agent = p.get('agent') || undefined

  if (hasMultica()) {
    const { getIssuesAsContent, getContentCounts } = await import('@/server/multica-db.js')
    const [items, counts] = await Promise.all([
      getIssuesAsContent(MULTICA_WORKSPACE_SLUG, state),
      getContentCounts(MULTICA_WORKSPACE_SLUG),
    ])
    return NextResponse.json({
      items,
      counts,
      reviewers: reviewerQueueCount(),
      project: project || null,
    })
  }

  const items = collect({ project, state, agent })
  return NextResponse.json({
    items,
    counts: countsFor(project),
    reviewers: reviewerQueueCount(),
    project: project || null,
  })
}
