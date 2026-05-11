import './Header.css'

export function Header() {
  return (
    <header className="dj-header">
      <div className="dj-brand">
        <div className="dj-logo" aria-hidden>
          <span className="dj-logo-dot" />
        </div>
        <h1 className="dj-wordmark">
          <span className="dj-wordmark-name">DaoJie ContentOS</span>
          <span className="dj-wordmark-sub">·本地数据</span>
        </h1>
      </div>
      <div className="dj-actions">
        <button className="dj-btn dj-btn-orange" type="button">
          <span className="dj-btn-icon">↻</span>
          <span>刷新</span>
        </button>
        <button className="dj-btn dj-btn-green" type="button">
          <span className="dj-btn-icon">◇</span>
          <span>同步发布</span>
        </button>
        <button className="dj-btn dj-btn-green-dark" type="button">
          <span className="dj-btn-icon">⤓</span>
          <span>导出 Excel</span>
        </button>
        <span className="dj-legacy">Airtable (legacy)</span>
      </div>
    </header>
  )
}
