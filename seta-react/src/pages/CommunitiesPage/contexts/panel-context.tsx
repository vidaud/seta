import { createContext, useContext, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

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

export type PanelData = {
  nrInvites?: number | undefined
  nrChangeRequests?: number | undefined
  nrMembershipRequests?: number | undefined
  handleNrInvites: (value: number) => void
  handleNrChangeRequests: (value: number) => void
  handleNrMembershipRequests: (value: number) => void
}

export const PanelNotificationsContext = createContext<PanelData | undefined>(undefined)

export const PanelProvider = ({ children }: ChildrenProp) => {
  const [nrInvites, setNrInvites] = useState<number | undefined>(0)
  const [nrChangeRequests, setNrChangeRequests] = useState<number | undefined>(0)
  const [nrMembershipRequests, setNrMembershipRequests] = useState<number | undefined>(0)

  const handleNrInvites = value => {
    setNrInvites(value)
  }

  const handleNrChangeRequests = value => {
    setNrChangeRequests(value)
  }

  const handleNrMembershipRequests = value => {
    setNrMembershipRequests(value)
  }

  const value: PanelData = {
    nrInvites: nrInvites,
    nrChangeRequests: nrChangeRequests,
    nrMembershipRequests: nrMembershipRequests,
    handleNrInvites: handleNrInvites,
    handleNrChangeRequests: handleNrChangeRequests,
    handleNrMembershipRequests: handleNrMembershipRequests
  }

  return (
    <PanelNotificationsContext.Provider value={value}>
      {children}
    </PanelNotificationsContext.Provider>
  )
}

export const usePanelNotifications = () => {
  const context = useContext(PanelNotificationsContext)

  if (context === undefined) {
    throw new Error('usePanelNotifications must be used within a PanelProvider')
  }

  return context
}
