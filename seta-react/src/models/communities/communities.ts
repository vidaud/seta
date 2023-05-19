export type Community = {
  community_id: string
  title: string
  description: string
  membership: string
  data_type: string
  status: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
  created_at: Date
}
