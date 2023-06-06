export type InviteResponse = {
  community_id: string
  invite_id: string
  invited_user: string
  message: string
  status: string
  initiated_by: string
  expire_date: Date
  initiated_date: Date
}

export type CreateInvitationAPI = {
  email: string[]
  message: string
}
