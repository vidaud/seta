export type DatasourceScopes = {
  user?: {
    id?: string
    fullName?: string
  }
  scope?: string
}

export type DatasourceResponse = {
  id?: string
  title: string
  description: string
  organisation: string
  themes: string[]
  created?: Date
  searchable?: boolean
  contact: {
    email: string
    person: string
    website: string
  }
  creator?: {
    id?: string
    fullName?: string
  }
  status?: string
  index?: string
  scopes?: DatasourceScopes[]
}

export type CreateDatasource = {
  id: string
  index: string
  title: string
  description: string
  organisation: string
  themes: string[]
  contact: {
    email: string
    person: string
    website: string
  }
}

export type DatasourcesResponse = {
  id: string
  title: string
  description: string
  organisation: string
  themes: string[]
  created: Date
  searchable: boolean
  contact: {
    email?: string
    person?: string
    website?: string
  }
}

export type RestrictedDatasource = {
  resource?: string
}
