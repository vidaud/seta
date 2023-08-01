export type UserInfo = {
  user_id: string
  full_name: string
  email: string
}

export enum RequestStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export enum CommunityField {
  Membership = 'membership'
}

export enum ResourceField {
  Limits = 'limits'
}

export type ChangeRequest = {
  request_id: string
  new_value: string
  old_value: string
  requested_by: string
  requested_by_info?: UserInfo
  status: RequestStatus
  initiated_date: Date
  reviewed_by?: string
  reviewed_by_info?: UserInfo
  review_date?: Date
}

export type CommunityChangeRequest = ChangeRequest & {
  community_id: string
  field_name: CommunityField
}

export type ResourceChangeRequest = ChangeRequest & {
  resource_id: string
  field_name: ResourceField
}
