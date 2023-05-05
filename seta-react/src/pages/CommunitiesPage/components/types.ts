export interface RowData {
  id: string
  title: string
  description: string
  data_type: string
  membership: string
  status: string
}

export interface TableSortProps {
  data: RowData[]
}

export interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}
