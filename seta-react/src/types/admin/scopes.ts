export type SystemScope = {
  area: string
  scope: string
}

export type CommunityScope = {
  community_id: string
  scopes: string[]
}

export type ResourceScope = {
  resource_id: string
  scopes: string[]
}

export type DatasourceScope = {
  data_source_id: string
  scopes: string[]
}

export type UserScopeList = {
  system_scopes?: SystemScope[]
  resource_scopes?: ResourceScope[]
  data_source_scopes?: DatasourceScope[]
}
