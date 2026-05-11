import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from './components/Header'
import { TabBar, type TabKey } from './components/TabBar'
import { StateFilter } from './components/StateFilter'
import { SectionToolbar } from './components/SectionToolbar'
import { ContentTable } from './components/ContentTable'
import { PreviewPane } from './components/PreviewPane'
import { ProjectOverview } from './components/ProjectOverview'
import { useContent } from './hooks/useContent'
import { useProjects } from './hooks/useProjects'
import { useRole } from './hooks/useRole'
import type { PipelineState } from './mockData'
import './App.css'

function App() {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const registry = useProjects()
  const defaultSlug = registry?.default || 'voc-ai'
  const slug = routeSlug || defaultSlug
  const [role, setRole] = useRole()

  const [tab, setTab] = useState<TabKey>('dashboard')
  const [pipeline, setPipeline] = useState<PipelineState>('bank')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterCore, setFilterCore] = useState<string>('all')

  const { data, refresh } = useContent({ project: slug, state: pipeline })
  const items = data?.items ?? []
  const counts = data?.counts ?? { 'new-idea': 0, 'draft': 0, 'bank': 0, 'published': 0 }

  const filtered = useMemo(() => {
    return items.filter(it => {
      if (filterType !== 'all' && it.frontmatter.platform !== filterType) return false
      if (filterCategory !== 'all' && it.agent !== filterCategory) return false
      void filterCore
      return true
    })
  }, [items, filterType, filterCategory, filterCore])

  const [selectedId, setSelectedId] = useState<string>('')
  const selected = filtered.find(i => i.id === selectedId) ?? filtered[0]

  const tabCounts = {
    dashboard: Object.keys(counts).length,
    inventory: counts.draft + counts.bank,
    review: data?.reviewers
      ? Object.values(data.reviewers).reduce((a, b) => a + b, 0)
      : 0,
    trending: counts['new-idea'],
    bank: counts.bank,
    local: counts.draft,
  }

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
            >👁️ MKT Reviewer</button>
          </div>
        </div>
        <a
          href="http://localhost:3100"
          target="_blank"
          rel="noreferrer"
          className="topbar-paperclip"
          title="Open in Paperclip (~/agent-teams) — Phase F"
        >
          📎 Paperclip
        </a>
      </div>

      <Header />
      <TabBar active={tab} onChange={setTab} counts={tabCounts} />

      {tab === 'dashboard' ? (
        <ProjectOverview slug={slug} />
      ) : (
        <>
          <StateFilter active={pipeline} onChange={setPipeline} counts={counts} />
          <div className="content-grid">
            <div className="content-main">
              <SectionToolbar
                filterType={filterType}
                filterCategory={filterCategory}
                filterCore={filterCore}
                onType={setFilterType}
                onCategory={setFilterCategory}
                onCore={setFilterCore}
              />
              <ContentTable
                items={filtered}
                selectedId={selected?.id || ''}
                onSelect={setSelectedId}
                onReview={role === 'reviewer' ? async (item, action, reason) => {
                  const reviewer = (item.frontmatter.reviewer as string) || ''
                  if (!reviewer) { alert('No reviewer in frontmatter'); return }
                  const r = await fetch('/api/review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewer, id: item.id, action, reason: reason || '' }),
                  }).then(r => r.json())
                  if (r.code !== 0) alert('Review failed: ' + (r.stderr || r.stdout))
                  refresh()
                } : undefined}
              />
            </div>
            <PreviewPane item={selected} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
