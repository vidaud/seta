import type { UserScopeList } from './scopes'

import type { UserRole } from '../user'

export type UserInfo = {
  user_id: string
  full_name: string
  email: string
}

export enum AccountStatus {
  Active = 'active',
  Disabled = 'disabled',
  Blocked = 'blocked',
  Deleted = 'deleted'
}

export enum ThirdPartyProvider {
  ECAS = 'ecas',
  GitHub = 'github',
  SETA = 'seta'
}

export type SetaUserInfo = {
  username: string
  fullName: string
  email: string
  role?: UserRole
  status?: AccountStatus
}

export type AccountDetail = {
  hasRsaKey: boolean
  appsCount: number
  lastActive?: Date
}

export type ExternalProvider = {
  providerUid: string
  provider: ThirdPartyProvider
  firstName: string
  lastName: string
}

export type SetaAccount = {
  username: string
  email: string
  role: UserRole
  status: AccountStatus
  createdAt: Date
  lastModifiedAt?: Date
  externalProviders: ExternalProvider[]
  details?: AccountDetail
  scopes?: UserScopeList
}
