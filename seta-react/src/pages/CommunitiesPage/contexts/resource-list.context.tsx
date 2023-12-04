import { createContext, useContext, useState } from 'react'

import { useMemberCommunities } from '~/api/communities/communities/member-communities'
import type { CommunityResponse } from '~/api/types/community-types'

export interface ResourceListContextValue {
  memberCommunities?: CommunityResponse[] | undefined
  selected?: string
  handleMemberCommunities: (value) => void
  handleSearchableChange: (value) => void
}

export const ResourceContext = createContext<ResourceListContextValue | undefined>(undefined)

export const ResourceListProvider = ({ children }) => {
  const { data } = useMemberCommunities()
  const [memberCommunities, setMemberCommunities] = useState(data)
  const [selected, setSelected] = useState<string | undefined>('all')

  data?.filter(item => item.status === 'membership').map(el => el.community_id)

  const handleMemberCommunities = value => {
    setMemberCommunities(value)
  }

  const handleSearchableChange = value => {
    setSelected(value)
  }

  const values: ResourceListContextValue | undefined = {
    memberCommunities: memberCommunities,
    selected: selected,
    handleMemberCommunities: handleMemberCommunities,
    handleSearchableChange: handleSearchableChange
  }

  return <ResourceContext.Provider value={values}>{children}</ResourceContext.Provider>
}

export const useResourceListContext = () => {
  const context = useContext(ResourceContext)

  if (context === undefined) {
    throw new Error('useResourceListContext must be used within a ResourceListProvider')
  }

  return context
}
