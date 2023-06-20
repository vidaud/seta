export type UserPermissionsResponse = {
  user_id: string
  scopes: string[]
  user_info: {
    user_id: string
    full_name: string
    email: string
  }
}
