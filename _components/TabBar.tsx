'use client'
import './TabBar.css'

export type TabKey = 'overview' | 'north-star' | 'ledger' | 'ideas' | 'drafts' | 'review' | 'bank' | 'published'

type Counts = {
  overview: number | null
  'north-star': number | null
  ledger: number | null
  ideas: number | null
  drafts: number | null
  review: number | null
  bank: number | null
  published: number | null
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview',   icon: '📍', label: 'Overview' },
  { key: 'north-star', icon: '📊', label: 'North Star' },
  { key: 'ledger',     icon: '📒', label: 'Ledger' },
  { key: 'ideas',      icon: '💡', label: 'Ideas' },
  { key: 'drafts',     icon: '📝', label: 'Drafts' },
  { key: 'review',     icon: '👁',  label: 'Review' },
  { key: 'bank',       icon: '🏦', label: 'Bank' },
  { key: 'published',  icon: '📰', label: 'Published' },
]

export function TabBar({
  active,
  onChange,
  counts,
}: {
  active: TabKey
  onChange: (k: TabKey) => void
  counts: Counts
}) {
  return (
    <nav className="dj-tabs">
      {TABS.map(t => {
        const n = counts[t.key]
        const isActive = active === t.key
        const isAlert = t.key === 'review' && typeof n === 'number' && n > 0
        return (
          <button
            key={t.key}
            type="button"
            className={`dj-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            <span className="dj-tab-icon">{t.icon}</span>
            <span>{t.label}</span>
            {typeof n === 'number' && n > 0 && (
              <span className={`dj-tab-badge ${isAlert ? 'is-alert' : ''}`}>{n}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
