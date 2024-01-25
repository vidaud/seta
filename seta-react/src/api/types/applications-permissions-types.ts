export type ApplicationPermissions = {
  resourceId: string
  scopes: string[]
  communityId?: string
  title?: string
}

export type PermissionsRequest = {
  resourceId?: string
  scopes: string[] | null
}

export type ApplicationModel = {
  user_id: string
  name: string
  description: string
  status: string
  provider: string
}
