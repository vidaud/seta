export type ResourceResponse = {
  resource_id: string
  community_id: string
  community_title: string
  title: string
  abstract: string
  searchable: boolean
  limits?: {
    total_files_no: number
    total_storage_mb: number
    file_size_mb: number
  }
  status?: string
  creator_id?: string
  creator?: {
    user_id?: string
    full_name?: string
    email?: string
  }
  created_at: Date
}

export type CreateResourceAPI = {
  community_id?: string
  resource_id?: string
  title: string
  abstract: string
  type?: string
}

export type UpdateResourceAPI = {
  community_id?: string
  resource_id?: string
  title: string
  abstract: string
  status?: string
  type?: string
}

export type RestrictedResource = {
  resource?: string
}
