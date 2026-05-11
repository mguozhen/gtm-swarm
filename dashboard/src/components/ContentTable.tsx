import './ContentTable.css'
import { CATEGORIES, type ContentRow } from '../mockData'

export function ContentTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: ContentRow[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="dj-table-wrap">
      <table className="dj-table">
        <thead>
          <tr>
            <th>INDEX</th>
            <th>类型</th>
            <th>预览</th>
            <th>标题 / 分类</th>
            <th>CORE CONTENT</th>
            <th>CONTENT STATUS</th>
            <th>REVIEW</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr
              key={r.id}
              className={r.id === selectedId ? 'is-selected' : ''}
              onClick={() => onSelect(r.id)}
            >
              <td className="dj-td-index">{r.id}</td>
              <td>
                <span className="dj-type-pill">
                  {r.type === 'video' ? '🎬' : r.type === 'image' ? '🖼️' : '📝'} {r.type}
                </span>
              </td>
              <td>
                <div className="dj-preview-thumb">{r.preview}</div>
              </td>
              <td>
                <div className="dj-td-title">{r.title}</div>
                <div className="dj-td-category">
                  {CATEGORIES[r.category].emoji} {CATEGORIES[r.category].label}
                </div>
              </td>
              <td className="dj-td-core">{r.coreContent}</td>
              <td>
                <StatusPill status="Stocked" />
              </td>
              <td>
                <ReviewPill review={r.review} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusPill({ status }: { status: 'Stocked' }) {
  return <span className="dj-pill dj-pill-stocked">{status}</span>
}

function ReviewPill({ review }: { review: ContentRow['review'] }) {
  const cls =
    review === 'Approved' ? 'dj-pill dj-pill-approved' :
    review === 'Rejected' ? 'dj-pill dj-pill-rejected' :
    'dj-pill dj-pill-stocked'
  return <span className={cls}>{review}</span>
}
