import { createContext, useContext, useEffect, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

import { useUserPermissions } from '../../../../api/communities/user-scopes'

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

const UserPermissionsContext = createContext<UserPermissions | undefined>(undefined)

export const ScopeProvider = ({ children }: ChildrenProp) => {
  const [systemScopes, setSystemScopes] = useState<SystemScopes[] | undefined>(undefined)
  const [communityScopes, setCommunityScopes] = useState<CommunityScopes[] | undefined>(undefined)
  const [resourceScopes, setResourceScopes] = useState<ResourceScopes[] | undefined>(undefined)
  const { data } = useUserPermissions()

  useEffect(() => {
    setSystemScopes(data?.system_scopes)
    setCommunityScopes(data?.community_scopes)
    setResourceScopes(data?.resource_scopes)
  }, [data])

  const value: UserPermissions = {
    system_scopes: systemScopes,
    community_scopes: communityScopes,
    resource_scopes: resourceScopes
  }

  return <UserPermissionsContext.Provider value={value}>{children}</UserPermissionsContext.Provider>
}

export const useCurrentUserPermissions = () => {
  const context = useContext(UserPermissionsContext)

  if (context === undefined) {
    throw new Error('useCurrentUserPermissions must be used within a ScopeProvider')
  }

  return context
}
