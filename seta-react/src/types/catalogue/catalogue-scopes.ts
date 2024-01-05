export type CategoryScopesResponse = {
  code: string
  description: string
  name: string
  elevated: boolean
}

export type CatalogueScopesResponse = {
  system: CategoryScopesResponse[]
  community: CategoryScopesResponse[]
  resource: CategoryScopesResponse[]
  datasource: CategoryScopesResponse[]
}

export enum ScopeCategory {
  System = 'system',
  Community = 'community',
  Resource = 'resource',
  Datasource = 'data-source'
}
