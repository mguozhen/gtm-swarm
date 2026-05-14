import { NextRequest, NextResponse } from 'next/server'
import { hasMultica } from '@/server/multica-db.js'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const { issue_id, action, reason } = await request.json()
  if (!issue_id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'issue_id and action (approve|reject) required' }, { status: 400 })
  }
  if (!hasMultica()) return NextResponse.json({ error: 'multica not configured' }, { status: 503 })

  const {
    getIssue, updateIssueStatus, getOrCreateGTMUser,
    postComment, dispatchAgentTask, getWorkspaceBySlug,
  } = await import('@/server/multica-db.js')

  const issue = await getIssue(issue_id)
  if (!issue) return NextResponse.json({ error: 'issue not found' }, { status: 404 })

  const ws = await getWorkspaceBySlug(MULTICA_WORKSPACE_SLUG)
  const botId = await getOrCreateGTMUser(ws?.id)

  const agentId = issue.assignee_id as string | null
  const agentName = issue.assignee_name as string | null

  if (action === 'approve') {
    // 1. Notify agent via comment + dispatch task
    if (agentId) {
      const mention = `[@${agentName || agentId}](mention://agent/${agentId})`
      const commentBody = `${mention} ✅ Review 通过！内容已进入 Bank，请按发布规则调度发布。`
      const commentId = await postComment(issue_id, {
        body: commentBody, authorId: botId, authorType: 'member', workspaceId: ws?.id,
      })
      const agentRow = await import('@/server/multica-db.js').then(m => m.getWorkspaceAgents(MULTICA_WORKSPACE_SLUG))
        .then((agents: { id: string; runtime_id: string }[]) => agents.find(a => a.id === agentId))
      if (agentRow?.runtime_id) {
        await dispatchAgentTask(agentId, agentRow.runtime_id, issue_id, {
          triggerCommentId: commentId,
          triggerSummary: commentBody,
        })
      }
    }

    // 2. Update Multica issue status → done (= bank)
    await updateIssueStatus(issue_id, 'done')

    // 3. Record in GTM DB
    if (hasDB() && ws) {
      const gtmWs = await store.getWorkspace(MULTICA_WORKSPACE_SLUG)
      if (gtmWs) {
        await store.upsertReviewResult(issue_id, {
          workspace_id: gtmWs.id,
          state: 'bank',
          frontmatter: {
            topic: issue.title,
            review_action: 'approve',
            reviewed_at: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json({ ok: true, action: 'approve', issue_id })
  }

  if (action === 'reject') {
    const rejectReason = reason || 'No reason given'

    // 1. Notify agent via comment
    if (agentId) {
      const mention = `[@${agentName || agentId}](mention://agent/${agentId})`
      const commentBody = `${mention} ❌ Review 未通过：${rejectReason}\n\n请修改后重新将状态改为 In Review 提交。`
      await postComment(issue_id, {
        body: commentBody, authorId: botId, authorType: 'member', workspaceId: ws?.id,
      })
    }

    // 2. Update Multica issue status → cancelled
    await updateIssueStatus(issue_id, 'cancelled')

    // 3. Record in GTM DB
    if (hasDB() && ws) {
      const gtmWs = await store.getWorkspace(MULTICA_WORKSPACE_SLUG)
      if (gtmWs) {
        await store.upsertReviewResult(issue_id, {
          workspace_id: gtmWs.id,
          state: 'draft',
          frontmatter: {
            topic: issue.title,
            review_action: 'reject',
            review_reason: rejectReason,
            reviewed_at: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json({ ok: true, action: 'reject', issue_id })
  }
}
