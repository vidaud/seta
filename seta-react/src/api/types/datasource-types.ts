export type DatasourceResponse = {
  resource_id: string
  organization: string
  community_title: string
  title: string
  abstract: string
  description: string
  searchable: boolean
  status?: string
  creator_id?: string
  creator?: {
    user_id?: string
    full_name?: string
    email?: string
  }
  created_at: Date
  link?: string
  theme_list?: string[]
}

export type RestrictedDatasource = {
  resource?: string
}
