export type CatalogueRole = {
  code: string
  description: string
  name: string
  defaultScopes: string[]
}

export type RolesCatalogue = {
  application: CatalogueRole[]
  community: CatalogueRole[]
}

export enum RoleCategory {
  Application = 'application',
  Community = 'community'
}
