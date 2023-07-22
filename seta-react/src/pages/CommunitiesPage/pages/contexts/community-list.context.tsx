import { createContext, useContext, useEffect, useState } from 'react'

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

export interface CommunityListContextValue {
  membership?: string
  status?: string
  system_scopes?: SystemScopes[] | undefined
  community_scopes?: CommunityScopes[] | undefined
  resource_scopes?: ResourceScopes[] | undefined
  handleStatusChange: (text: string) => void
  handleMembershipChange: (text: string) => void
}

export const CommunityContext = createContext<CommunityListContextValue | undefined>(undefined)

export const CommunityListProvider = ({ children }) => {
  const [membership, setMembership] = useState<string | undefined>('all')
  const [status, setStatus] = useState<string | undefined>('all')
  const [systemScopes, setSystemScopes] = useState<SystemScopes[] | undefined>(undefined)
  const [communityScopes, setCommunityScopes] = useState<CommunityScopes[] | undefined>(undefined)
  const [resourceScopes, setResourceScopes] = useState<ResourceScopes[] | undefined>(undefined)
  const { data } = useUserPermissions()

  useEffect(() => {
    setSystemScopes(data?.system_scopes)
    setCommunityScopes(data?.community_scopes)
    setResourceScopes(data?.resource_scopes)
  }, [data])

  const handleStatusChange = text => {
    setStatus(text)
  }

  const handleMembershipChange = text => {
    setMembership(text)
  }

  const values: CommunityListContextValue | undefined = {
    membership: membership,
    status: status,
    system_scopes: systemScopes,
    community_scopes: communityScopes,
    resource_scopes: resourceScopes,
    handleMembershipChange: handleMembershipChange,
    handleStatusChange: handleStatusChange
  }

  return <CommunityContext.Provider value={values}>{children}</CommunityContext.Provider>
}

export const useCommunityListContext = () => {
  const context = useContext(CommunityContext)

  if (context === undefined) {
    throw new Error('useCommunityListContext must be used within a CommunityListProvider')
  }

  return context
}
// export const [CommunityListProvider, useCommunityListContext] =
//   createSafeContext<CommunityListContextValue>('List component was not found in tree')
