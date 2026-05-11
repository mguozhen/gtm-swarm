import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { TabBar, type TabKey } from './components/TabBar'
import { StateFilter } from './components/StateFilter'
import { SectionToolbar } from './components/SectionToolbar'
import { ContentTable } from './components/ContentTable'
import { PreviewPane } from './components/PreviewPane'
import { MOCK_ROWS, PIPELINE_COUNTS, TAB_COUNTS, type PipelineState } from './mockData'
import './App.css'

function App() {
  const [tab, setTab] = useState<TabKey>('bank')
  const [pipeline, setPipeline] = useState<PipelineState>('bank')
  const [selectedId, setSelectedId] = useState<string>('BANK-FR-AT-01')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterCore, setFilterCore] = useState<string>('all')

  const rows = useMemo(() => {
    return MOCK_ROWS.filter(r => {
      if (filterType !== 'all' && r.type !== filterType) return false
      if (filterCategory !== 'all' && r.category !== filterCategory) return false
      if (filterCore !== 'all' && r.coreContent !== filterCore) return false
      return true
    })
  }, [filterType, filterCategory, filterCore])

  const selectedRow = MOCK_ROWS.find(r => r.id === selectedId) ?? MOCK_ROWS[0]

  return (
    <div className="page">
      <Header />
      <TabBar active={tab} onChange={setTab} counts={TAB_COUNTS} />
      <StateFilter active={pipeline} onChange={setPipeline} counts={PIPELINE_COUNTS} />
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
          <ContentTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <PreviewPane row={selectedRow} />
      </div>
    </div>
  )
}

export default App
