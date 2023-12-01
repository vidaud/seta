export interface RowData {
  id: string
  title: string
  description: string
  data_type: string
  membership: string
  status: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
}

export interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

export const themeColors: Record<string, string> = {
  0: 'green',
  1: 'blue',
  2: 'red',
  3: 'orange',
  4: 'gray'
}
