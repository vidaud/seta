export type DatasourceResponse = {
  id: string
  title: string
  description: string
  organisation: string
  theme: string
  created_at: Date
  searchable: boolean
  contact?: {
    email?: string
    person?: string
    website?: string
  }
}

export type RestrictedDatasource = {
  resource?: string
}
