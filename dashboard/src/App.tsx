import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from './components/Header'
import { TabBar, type TabKey } from './components/TabBar'
import { ContentTable } from './components/ContentTable'
import { PreviewPane } from './components/PreviewPane'
import { ProjectOverview } from './components/ProjectOverview'
import { IdeasPool } from './components/IdeasPool'
import { useContent } from './hooks/useContent'
import { useProjects } from './hooks/useProjects'
import { useRole } from './hooks/useRole'
import './App.css'

const TAB_TO_STATE: Record<Exclude<TabKey, 'overview' | 'review'>, 'new-idea' | 'draft' | 'bank' | 'published'> = {
  ideas: 'new-idea',
  drafts: 'draft',
  bank: 'bank',
  published: 'published',
}

function App() {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const registry = useProjects()
  const defaultSlug = registry?.default || 'voc-ai'
  const slug = routeSlug || defaultSlug
  const [role, setRole] = useRole()

  const [tab, setTab] = useState<TabKey>('overview')

  const requestedState = tab === 'overview' ? undefined
    : tab === 'review' ? undefined
    : TAB_TO_STATE[tab]

  const { data, refresh } = useContent({ project: slug, state: requestedState })
  const items = data?.items ?? []
  const counts = data?.counts ?? { 'new-idea': 0, 'draft': 0, 'bank': 0, 'published': 0 }
  const reviewerQueueTotal = data?.reviewers
    ? Object.values(data.reviewers).reduce((a, b) => a + b, 0)
    : 0

  const filtered = useMemo(() => {
    if (tab === 'review') {
      return items.filter(it => it.state === 'draft')
    }
    return items
  }, [items, tab])

  const [selectedId, setSelectedId] = useState<string>('')
  const selected = filtered.find(i => i.id === selectedId) ?? filtered[0]

  const tabCounts = {
    overview: null,
    ideas: counts['new-idea'],
    drafts: counts.draft,
    review: reviewerQueueTotal,
    bank: counts.bank,
    published: counts.published,
  }

  const reviewAction = role === 'reviewer' ? async (item: typeof items[number], action: 'approve' | 'reject', reason?: string) => {
    const reviewer = (item.frontmatter.reviewer as string) || ''
    if (!reviewer) { alert('No reviewer in frontmatter'); return }
    const r = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer, id: item.id, action, reason: reason || '' }),
    }).then(r => r.json())
    if (!r.ok && r.code !== 0) alert('Review failed: ' + (r.stderr || r.error || ''))
    refresh()
  } : undefined

  return (
    <div className="page">
      <div className="topbar">
        <Link to="/" className="topbar-back">← projects</Link>
        <div className="topbar-project">
          <span className="tp-label">PROJECT</span>
          <select
            value={slug}
            onChange={e => { window.location.href = `/dashboard/${e.target.value}` }}
            className="tp-select"
          >
            {registry && Object.values(registry.projects).map(p => (
              <option key={p.slug} value={p.slug}>
                {p.name} {p.status === 'stub' ? '(stub)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="topbar-role">
          <span className="tr-label">VIEW</span>
          <div className="tr-toggle">
            <button
              className={role === 'founder' ? 'is-active' : ''}
              onClick={() => setRole('founder')}
            >👤 Founder</button>
            <button
              className={role === 'reviewer' ? 'is-active' : ''}
              onClick={() => setRole('reviewer')}
            >👁️ Reviewer</button>
          </div>
        </div>
        <a
          href="https://github.com/mguozhen/gtm-swarm"
          target="_blank"
          rel="noreferrer"
          className="topbar-paperclip"
          title="Source on GitHub"
        >
          ⭐ GitHub
        </a>
      </div>

      <Header onRefresh={refresh} />
      <TabBar active={tab} onChange={setTab} counts={tabCounts} />

      {tab === 'overview' ? (
        <ProjectOverview slug={slug} />
      ) : tab === 'ideas' ? (
        <IdeasPool
          items={items.filter(i => i.state === 'new-idea')}
          onPromote={async item => {
            const r = await fetch('/api/promote-idea', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project: item.project, agent: item.agent, idea_id: item.id }),
            }).then(r => r.json())
            if (r.ok) {
              alert('✓ Drafted: ' + (r.topic || '').slice(0, 60))
            } else {
              alert('Promote failed: ' + (r.error || r.stderr || 'unknown'))
            }
            refresh()
          }}
          onReject={async (item, reason) => {
            await fetch('/api/reject-idea', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project: item.project, agent: item.agent, idea_id: item.id, reason }),
            })
            refresh()
          }}
        />
      ) : (
        <div className="content-grid">
          <div className="content-main">
            <div className="state-banner">
              <span className="state-banner-label">
                {tab === 'review' ? '👁 Pending Review' :
                 tab === 'drafts' ? '📝 In-progress Drafts' :
                 tab === 'bank' ? '🏦 Approved + Bank' :
                 '📰 Published'}
              </span>
              <span className="state-banner-count">{filtered.length} items</span>
              {tab === 'review' && role !== 'reviewer' && (
                <span className="state-banner-hint">Switch to Reviewer view (top right) to approve/reject inline.</span>
              )}
            </div>
            <ContentTable
              items={filtered}
              selectedId={selected?.id || ''}
              onSelect={setSelectedId}
              onReview={tab === 'review' || tab === 'drafts' ? reviewAction : undefined}
            />
          </div>
          <PreviewPane item={selected} />
        </div>
      )}
    </div>
  )
}

export default App
