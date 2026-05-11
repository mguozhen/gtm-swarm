export type ContentType = 'video' | 'image' | 'text'
export type ReviewState = 'Stocked' | 'Approved' | 'Rejected'
export type PipelineState = 'new-idea' | 'draft' | 'bank' | 'published'

export type CategoryKey = 'AT' | 'OB' | 'AD' | 'SM' | 'EC' | 'AU' | 'CM'

export const CATEGORIES: Record<CategoryKey, { label: string; emoji: string }> = {
  AT: { label: 'AI工具', emoji: '🤖' },
  OB: { label: '网络创业', emoji: '🌐' },
  AD: { label: '广告投放', emoji: '🎯' },
  SM: { label: '社媒增长', emoji: '📱' },
  EC: { label: '电商', emoji: '🛒' },
  AU: { label: '自动化', emoji: '⚙️' },
  CM: { label: '内容矩阵', emoji: '🧩' },
}

export type ContentRow = {
  id: string
  type: ContentType
  preview: string
  title: string
  category: CategoryKey
  coreContent: string
  status: PipelineState
  review: ReviewState
}

export const MOCK_ROWS: ContentRow[] = [
  { id: 'BANK-FR-AT-01', type: 'video', preview: '🎬', title: 'BANK-FR-AT-01',  category: 'AT', coreContent: 'ContentOS',  status: 'bank', review: 'Stocked' },
  { id: 'BANK-FR-OB-01', type: 'video', preview: '🌐', title: 'BANK-FR-OB-01',  category: 'OB', coreContent: '—',          status: 'bank', review: 'Stocked' },
  { id: 'BANK-FR-AD-01', type: 'video', preview: '🎯', title: 'BANK-FR-AD-01',  category: 'AD', coreContent: '—',          status: 'bank', review: 'Stocked' },
  { id: 'BANK-SM-01',    type: 'image', preview: '📊', title: 'BANK-SM-01',     category: 'SM', coreContent: '—',          status: 'bank', review: 'Rejected' },
  { id: 'BANK-FR-EC-01', type: 'video', preview: '🛒', title: 'BANK-FR-EC-01',  category: 'EC', coreContent: '—',          status: 'bank', review: 'Stocked' },
  { id: 'BANK-AU-02',    type: 'image', preview: '⚙️', title: 'BANK-AU-02',     category: 'AU', coreContent: '—',          status: 'bank', review: 'Rejected' },
  { id: 'BANK-FR-AU-01', type: 'video', preview: '⚙️', title: 'BANK-FR-AU-01',  category: 'AU', coreContent: '—',          status: 'bank', review: 'Stocked' },
  { id: 'BANK-SM-04',    type: 'image', preview: '📲', title: 'BANK-SM-04',     category: 'SM', coreContent: '—',          status: 'bank', review: 'Rejected' },
  { id: 'BANK-FR-CM-01', type: 'video', preview: '🧩', title: 'BANK-FR-CM-01',  category: 'CM', coreContent: '—',          status: 'bank', review: 'Stocked' },
  { id: 'BANK-FR-AT-02', type: 'image', preview: '🤖', title: 'BANK-FR-AT-02',  category: 'AT', coreContent: 'ManyChat',   status: 'bank', review: 'Approved' },
  { id: 'BANK-FR-OB-02', type: 'video', preview: '🚀', title: 'BANK-FR-OB-02',  category: 'OB', coreContent: 'OPUS Clip',  status: 'bank', review: 'Approved' },
  { id: 'BANK-FR-AD-02', type: 'video', preview: '💰', title: 'BANK-FR-AD-02',  category: 'AD', coreContent: 'Meta Ads',   status: 'bank', review: 'Approved' },
  { id: 'BANK-FR-EC-02', type: 'video', preview: '📦', title: 'BANK-FR-EC-02',  category: 'EC', coreContent: 'Shopify',    status: 'bank', review: 'Approved' },
  { id: 'BANK-FR-CM-02', type: 'image', preview: '🎨', title: 'BANK-FR-CM-02',  category: 'CM', coreContent: 'Canva',      status: 'bank', review: 'Approved' },
]

export const PIPELINE_COUNTS = {
  'new-idea': 1,
  'draft': 45,
  'bank': 31,
  'published': 39,
}

export const TAB_COUNTS = {
  dashboard: 34,
  inventory: null,
  review: 1,
  trending: 14,
  bank: null,
  local: 19,
}
