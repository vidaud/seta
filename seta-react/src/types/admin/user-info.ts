export type UserInfo = {
  user_id: string
  full_name: string
  email: string
}

export enum UserRole {
  Administrator = 'Administrator',
  User = 'User'
}

export enum AccountStatus {
  Active = 'active',
  Disabled = 'disabled',
  Blocked = 'blocked'
}

export type SetaUserInfo = {
  username: string
  fullName: string
  email: string
  role?: UserRole
  status?: AccountStatus
}
