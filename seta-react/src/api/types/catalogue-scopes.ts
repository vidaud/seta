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
}
