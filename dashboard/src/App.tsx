import { useMemo, useState, useEffect } from 'react'
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
import { useToken, postJson } from './hooks/useToken'
import { TokenGate } from './components/TokenGate'
import './App.css'

const TAB_TO_STATE: Record<Exclude<TabKey, 'overview' | 'review'>, 'new-idea' | 'draft' | 'bank' | 'published'> = {
  ideas: 'new-idea',
  drafts: 'draft',
  bank: 'bank',
  published: 'published',
}

type AgentRow = {
  id: string
  channel: string
  status: string
  config: Record<string, unknown>
  metrics: Record<string, unknown>
  review_checklist: string[]
  dashboard_widgets: unknown[]
  kpi_defaults: Record<string, string>
}


const CHANNEL_COLORS: Record<string, string> = {
  reddit: '#ff4500', x: '#1d9bf0', blog: '#10b981',
  'kol-koc': '#f59e0b', video: '#ef4444',
}

function AgentChannelCard({ agent }: { agent: AgentRow }) {
  const color = CHANNEL_COLORS[agent.channel] || '#6b7280'
  const metrics30d = (agent.metrics as Record<string, Record<string, number>>)?.rolling_30d || {}
  return (
    <div style={{ background: '#1f2937', border: `1px solid ${color}33`, borderRadius: 10, padding: 14, minWidth: 160, flex: '0 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: agent.status === 'active' ? '#10b981' : '#6b7280' }} />
        <span style={{ fontWeight: 700, fontSize: 12, color }}>{agent.channel}</span>
        <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 'auto' }}>{agent.status}</span>
      </div>
      {agent.kpi_defaults?.weekly_target && (
        <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>
          {agent.kpi_defaults.weekly_target}
        </div>
      )}
      {Object.keys(metrics30d).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 8 }}>
          {Object.entries(metrics30d).map(([k, v]) => (
            <div key={k} style={{ fontSize: 9, color: '#9ca3af' }}>
              <span style={{ color: '#f9fafb', fontWeight: 600 }}>{v}</span> {k}
            </div>
          ))}
        </div>
      )}
      <button style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid #374151',
        background: 'transparent', color: '#9ca3af', cursor: 'pointer', width: '100%' }}>
        查看队列
      </button>
    </div>
  )
}

function App() {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const registry = useProjects()
  const defaultSlug = registry?.default || 'voc-ai'
  const slug = routeSlug || defaultSlug
  const [role, setRole] = useRole()
  const [token, setToken, clearToken] = useToken()

  const [tab, setTab] = useState<TabKey>('overview')

  const [wsData, setWsData] = useState<{
    lifecycle_state?: string
    agents?: AgentRow[]
  } | null>(null)

  useEffect(() => {
    fetch(`/api/workspaces/${slug}`)
      .then(r => r.json())
      .then(d => { if (d && !d.error) setWsData(d) })
      .catch(() => {})
  }, [slug])

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
    const r = await postJson<{ ok?: boolean; error?: string; stderr?: string }>('/api/review', { reviewer, id: item.id, action, reason: reason || '' }, token)
    if (r.error) alert('Review failed: ' + r.error + (r.error.includes('401') ? ' — click 🔒 Sign in (top bar).' : ''))
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
        <TokenGate token={token} onSet={setToken} onClear={clearToken} />
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
        <div>
          <ProjectOverview slug={slug} />
          {wsData?.agents && wsData.agents.length > 0 && (
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Agent Channels
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {wsData.agents.map(agent => (
                  <AgentChannelCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : tab === 'ideas' ? (
        <IdeasPool
          items={items.filter(i => i.state === 'new-idea')}
          onPromote={async item => {
            const r = await postJson<{ ok?: boolean; topic?: string; error?: string }>('/api/promote-idea', { project: item.project, agent: item.agent, idea_id: item.id }, token)
            if (r.ok) alert('✓ Drafted: ' + (r.topic || '').slice(0, 60))
            else alert('Promote failed: ' + (r.error || 'unknown') + (String(r.error || '').includes('401') ? ' — click 🔒 Sign in (top bar).' : ''))
            refresh()
          }}
          onReject={async (item, reason) => {
            await postJson('/api/reject-idea', { project: item.project, agent: item.agent, idea_id: item.id, reason }, token)
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
