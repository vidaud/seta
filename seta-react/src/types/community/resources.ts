export type Resource = {
  resource_id: string
  community_id: string
  title: string
  abstract: string
  limits: {
    total_files_no: number
    total_storage_mb: number
    file_size_mb: number
  }
  status: string
  creator_id: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
  created_at: Date
}
