import { createContext, useContext, useState } from 'react'

export interface CommunityListContextValue {
  membership?: string
  status?: string
  handleStatusChange: (text: string) => void
  handleMembershipChange: (text: string) => void
}

export const CommunityContext = createContext<CommunityListContextValue | undefined>(undefined)

export const CommunityListProvider = ({ children }) => {
  const [membership, setMembership] = useState<string | undefined>('all')
  const [status, setStatus] = useState<string | undefined>('all')

  const handleStatusChange = text => {
    setStatus(text)
  }

  const handleMembershipChange = text => {
    setMembership(text)
  }

  const data: CommunityListContextValue | undefined = {
    membership: membership,
    status: status,
    handleMembershipChange: handleMembershipChange,
    handleStatusChange: handleStatusChange
  }

  return <CommunityContext.Provider value={data}>{children}</CommunityContext.Provider>
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
