export type SystemScopes = {
  area: string
  scope: string
}

export type CommunityScopes = {
  community_id: string
  scopes: string[]
}

export type ResourceScopes = {
  resource_id: string
  scopes: string[]
}

export type UserPermissions = {
  system_scopes?: SystemScopes[] | undefined
  community_scopes?: CommunityScopes[] | undefined
  resource_scopes?: ResourceScopes[] | undefined
}
