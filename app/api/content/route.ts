import { NextRequest, NextResponse } from 'next/server'
import { collect, countsFor, reviewerQueueCount, type State } from '@/lib/fs-api'
import { hasMultica } from '@/server/multica-db.js'

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const project = p.get('project') || undefined
  const state = (p.get('state') || undefined) as State | undefined
  const agent = p.get('agent') || undefined

  if (hasMultica()) {
    const { getIssuesAsContent } = await import('@/server/multica-db.js')
    const items = await getIssuesAsContent(project!, state)
    return NextResponse.json({
      items,
      counts: {
        'new-idea': items.filter((i: { state: string }) => i.state === 'new-idea').length,
        'draft': items.filter((i: { state: string }) => i.state === 'draft').length,
        'bank': items.filter((i: { state: string }) => i.state === 'bank').length,
        'published': items.filter((i: { state: string }) => i.state === 'published').length,
      },
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
