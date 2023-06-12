export type InviteResponse = {
  community_id: string
  invite_id: string
  invited_user: string
  message: string
  status: string
  initiated_by: string
  expire_date: Date
  initiated_date: Date
  invited_user_info: {
    user_id: string
    full_name: string
    email: string
  }
  initiated_by_info: {
    user_id: string
    full_name: string
    email: string
  }
}

export type CreateInvitationAPI = {
  email: string[]
  message: string
}
