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

export type UserScopeList = {
  system_scopes?: SystemScope[]
  community_scopes?: CommunityScope[]
  resource_scopes?: ResourceScope[]
}
