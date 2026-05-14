import { NextRequest, NextResponse } from 'next/server'
import { hasMultica, getIssue, updateIssueStatus, getOrCreateGTMUser,
  postComment, dispatchAgentTask, getWorkspaceBySlug, getWorkspaceAgents } from '@/server/multica-db.js'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const { issue_id, action, reason } = await request.json()
    if (!issue_id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'issue_id and action (approve|reject) required' }, { status: 400 })
    }
    if (!hasMultica()) return NextResponse.json({ error: 'multica not configured' }, { status: 503 })

    const issue = await getIssue(issue_id)
    if (!issue) return NextResponse.json({ error: 'issue not found' }, { status: 404 })

    const ws = await getWorkspaceBySlug(MULTICA_WORKSPACE_SLUG)
    const botId = await getOrCreateGTMUser(ws?.id)
    const agentId: string | null = issue.assignee_id || null
    const agentName: string | null = issue.assignee_name || null

    if (action === 'approve') {
      if (agentId) {
        const mention = `[@${agentName || agentId}](mention://agent/${agentId})`
        const commentBody = `${mention} ✅ Review 通过！内容已进入 Bank，请按发布规则调度发布。`
        const commentId = await postComment(issue_id, {
          body: commentBody, authorId: botId, authorType: 'member', workspaceId: ws?.id,
        })
        const agents = await getWorkspaceAgents(MULTICA_WORKSPACE_SLUG)
        const agentRow = agents.find((a: { id: string }) => a.id === agentId)
        if (agentRow?.runtime_id) {
          await dispatchAgentTask(agentId, agentRow.runtime_id, issue_id, {
            triggerCommentId: commentId,
            triggerSummary: commentBody,
          })
        }
      }
      await updateIssueStatus(issue_id, 'done')
      if (hasDB()) {
        const gtmWs = await store.getWorkspace(MULTICA_WORKSPACE_SLUG)
        if (gtmWs) {
          await store.upsertReviewResult(issue_id, {
            workspace_id: gtmWs.id,
            state: 'bank',
            frontmatter: { topic: issue.title, review_action: 'approve', reviewed_at: new Date().toISOString() },
          })
        }
      }
      return NextResponse.json({ ok: true, action: 'approve', issue_id })
    }

    // reject
    const rejectReason = reason || 'No reason given'
    if (agentId) {
      const mention = `[@${agentName || agentId}](mention://agent/${agentId})`
      const commentBody = `${mention} ❌ Review 未通过：${rejectReason}\n\n请修改后重新将状态改为 In Review 提交。`
      await postComment(issue_id, {
        body: commentBody, authorId: botId, authorType: 'member', workspaceId: ws?.id,
      })
    }
    await updateIssueStatus(issue_id, 'cancelled')
    if (hasDB()) {
      const gtmWs = await store.getWorkspace(MULTICA_WORKSPACE_SLUG)
      if (gtmWs) {
        await store.upsertReviewResult(issue_id, {
          workspace_id: gtmWs.id,
          state: 'draft',
          frontmatter: { topic: issue.title, review_action: 'reject', review_reason: rejectReason, reviewed_at: new Date().toISOString() },
        })
      }
    }
    return NextResponse.json({ ok: true, action: 'reject', issue_id })

  } catch (e: unknown) {
    console.error('[review-multica]', e)
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 })
  }
}
