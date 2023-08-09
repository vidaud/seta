import type { UserInfo } from './user-info'

export enum Membership {
  Opened = 'opened',
  Closed = 'closed'
}

export enum Status {
  Active = 'active',
  Blocked = 'blocked'
}

export type Community = {
  community_id: string
  title: string
  description: string
  membership: Membership
  status: Status
  created_at: Date
  creator?: UserInfo
}
