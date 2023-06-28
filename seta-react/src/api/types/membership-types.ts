export type Memberships = {
  members: MembershipResponse[]
}

export type MembershipResponse = {
  community_id: string
  user_id: string
  user_info: {
    user_id: string
    full_name: string
    email: string
  }
  role: string
  join_date: Date
  status: string
}

export type CreateMembershipRequestAPI = {
  community_id?: string
  message?: string
}

export type MembershipRequest = {
  community_id: string
  requested_by: string
  message: string
  initiated_date: Date
  status: string
  reviewed_by: null
  review_date: Date
  reject_timeout: Date
  reviewed_by_info: {
    user_id: string
    full_name: string
    email: string
  }
  requested_by_info: {
    user_id: string
    full_name: string
    email: string
  }
}
