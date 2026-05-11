import './PreviewPane.css'
import { CATEGORIES, type ContentRow } from '../mockData'

export function PreviewPane({ row }: { row: ContentRow }) {
  const cat = CATEGORIES[row.category]
  return (
    <aside className="dj-preview">
      <div className="dj-preview-card">
        <div className="dj-preview-hero">
          <div className="dj-preview-hero-icon">{row.preview}</div>
          <div className="dj-preview-hero-meta">
            <div className="dj-preview-tag">
              {cat.emoji} {cat.label}
            </div>
            <div className="dj-preview-id">{row.id}</div>
          </div>
        </div>
        <div className="dj-preview-body">
          <div className="dj-preview-card-inner">
            <p className="dj-preview-card-eyebrow">{row.coreContent || '—'}</p>
            <h3 className="dj-preview-card-headline">{row.title}</h3>
            <p className="dj-preview-card-copy">
              The automation engine for agents.AI
            </p>
            <div className="dj-preview-card-mock-cta">体验 demo →</div>
          </div>
          <div className="dj-preview-tip">
            📌 Prompt 在 Caption 里，记得保存 !
          </div>
        </div>
        <footer className="dj-preview-footer">
          <div className="dj-preview-handle">
            <div className="dj-preview-avatar">D</div>
            <div>
              <div className="dj-preview-handle-name">Daojie</div>
              <div className="dj-preview-handle-sub">@daojiemarketing</div>
            </div>
          </div>
          <div className="dj-preview-swipe">Swipe →</div>
        </footer>
      </div>
      <div className="dj-preview-tip-card">
        <span className="dj-preview-tip-badge">Tip #1</span>
        <span className="dj-preview-tip-text">邮件序列</span>
      </div>
    </aside>
  )
}
