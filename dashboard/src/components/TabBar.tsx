import './TabBar.css'

export type TabKey = 'dashboard' | 'inventory' | 'review' | 'trending' | 'bank' | 'local'

type Counts = {
  dashboard: number | null
  inventory: number | null
  review: number | null
  trending: number | null
  bank: number | null
  local: number | null
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inventory', label: '库存 + 排程' },
  { key: 'review', label: '审核' },
  { key: 'trending', label: 'Trending' },
  { key: 'bank', label: 'Content Bank' },
  { key: 'local', label: 'Local Draft' },
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
            <span>{t.label}</span>
            {typeof n === 'number' && (
              <span className={`dj-tab-badge ${isAlert ? 'is-alert' : ''}`}>{n}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
