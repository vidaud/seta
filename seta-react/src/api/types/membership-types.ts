export type Memberships = {
  members: MembershipResponse[]
}

export type MembershipResponse = {
  community_id: string
  user_id: string
  role: string
  join_date: Date
  status: string
}

export type CreateMembershipRequestAPI = {
  community_id: string
  message: string
}
