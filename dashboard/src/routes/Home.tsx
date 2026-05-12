import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

type Project = {
  name: string; slug: string; url: string | null; category: string
  tagline: string; status: string; primary_audience?: string
  lifecycle_state?: string
}

type Registry = { default: string; projects: Record<string, Project> }

const STATE_COLOR: Record<string, string> = {
  onboarding: '#f59e0b',
  strategy: '#3b82f6',
  engine_building: '#8b5cf6',
  active: '#10b981',
  paused: '#6b7280',
  archived: '#374151',
}

const STATE_LABEL: Record<string, string> = {
  onboarding: 'Onboarding',
  strategy: 'Strategy',
  engine_building: 'Building Engine',
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
}

function LifecycleBadge({ state }: { state: string }) {
  return (
    <span style={{
      background: STATE_COLOR[state] || '#6b7280',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '12px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    }}>
      {STATE_LABEL[state] || state}
    </span>
  )
}

export default function Home() {
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [states, setStates] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setRegistry(d.registry))
  }, [])

  useEffect(() => {
    if (!registry) return
    Promise.all(Object.keys(registry.projects).map(slug =>
      fetch(`/api/contentos/${slug}/state`).then(r => r.json())
        .then(d => [slug, d.state.current_step || 0] as const)
        .catch(() => [slug, 0] as const)
    )).then(pairs => setStates(Object.fromEntries(pairs)))
  }, [registry])

  if (!registry) return <div className="home-loading">loading projects...</div>

  return (
    <div className="home">
      <header className="home-hero">
        <div className="hero-mark">▰▱▱▱</div>
        <h1>GTM Swarm <span className="hero-mark-accent">/ ContentOS</span></h1>
        <p className="hero-sub">Pick a product. ContentOS Agent runs market + user + competitor discovery. 11 GTM agents go live.</p>
        <Link to="/onboard" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
          + New Product
        </Link>
      </header>

      <section className="project-grid">
        {Object.values(registry.projects).map(p => {
          const step = states[p.slug] || 0
          const isStub = p.status === 'stub'
          const isBuilt = step >= 4
          const stepLabel = isBuilt ? 'Built · 11 agents live'
            : step === 0 ? 'Not started'
            : `Step ${step} / 4`
          return (
            <Link
              key={p.slug}
              to={isStub ? '#' : isBuilt ? `/dashboard/${p.slug}` : `/wizard/${p.slug}`}
              className={`project-card ${isStub ? 'is-stub' : ''} ${isBuilt ? 'is-built' : ''}`}
              onClick={e => isStub && e.preventDefault()}
            >
              <div className="pc-header">
                <span className="pc-name">{p.name}</span>
                {p.lifecycle_state
                  ? <LifecycleBadge state={p.lifecycle_state} />
                  : <span className={`pc-status pc-status-${p.status}`}>{p.status}</span>
                }
              </div>
              <div className="pc-tagline">{p.tagline}</div>
              <div className="pc-meta">
                <span className="pc-category">{p.category}</span>
                {p.url && <span className="pc-url">{p.url.replace(/^https?:\/\//, '')}</span>}
              </div>
              <div className="pc-progress">
                <div className="pc-progress-track">
                  <div className="pc-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
                </div>
                <span className="pc-progress-label">{stepLabel}</span>
              </div>
              <div className="pc-cta">
                {isStub ? 'Awaiting brief →' : isBuilt ? 'Open dashboard →' : step === 0 ? 'Start discovery →' : 'Resume wizard →'}
              </div>
            </Link>
          )
        })}
      </section>

      <footer className="home-footer">
        <span>GTM Swarm v0.1 · {Object.keys(registry.projects).length} projects · ContentOS Agent powered by Claude</span>
      </footer>
    </div>
  )
}
