import {
  IconUserPlus,
  IconNotification,
  IconBrandOpenSource,
  IconPlugConnected
} from '@tabler/icons-react'

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

export interface TableSortProps {
  data: RowData[]
}

export interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

export const jobColors: Record<string, string> = {
  CommunityOwner: 'blue',
  CommunityMember: 'green',
  CommunityManager: 'cyan',
  viewer: 'pink',
  contributor: 'yellow'
}

export const statusColors: Record<string, string> = {
  approved: 'blue',
  rejected: 'pink',
  pending: 'yellow'
}

export interface TableScrollAreaProps {
  data: { user: string; date: string; role: string }[]
}

export const icons = {
  member: IconUserPlus,
  resource: IconBrandOpenSource,
  community: IconPlugConnected,
  notification: IconNotification
}

export interface StatsGridProps {
  data: {
    title: string
    icon: string
    value: string
    diff: number
  }[]
}

export interface TableScrollProps {
  data: { user: string; date: string }[]
}

export interface TableResourceProps {
  data: {
    title: string
    description: string
    membership: string
    status: string
    createdAt: string
    createdBy: string
  }[]
}
