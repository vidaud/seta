export type Community = {
  community_id: string
  title: string
  description: string
  membership: string
  status: string
  created_at: Date
  creator: {
    user_id: string
    full_name: string
    email: string
  }
}
