import { createContext, useContext, useState } from 'react'
import type { AxiosRequestConfig } from 'axios'

import type { ChildrenProp } from '~/types/children-props'

import type { CommunityScopes, UserPermissions } from './scope-context'

import api from '../../../../api/api'
import community_api from '../../../../api/communities/api'
import type { InviteResponse } from '../../../../api/types/invite-types'
import type { MembershipRequest } from '../../../../api/types/membership-types'
import { environment } from '../../../../environments/environment'

type Notifications = {
  memberships: MembershipRequest[]
  invites: InviteResponse[]
  community_scopes?: CommunityScopes[] | undefined
}

type NotificationsContextProps = {
  notifications: Notifications[]
  getNotificationRequests: () => void
}

const BASE_URL = environment.baseUrl
const USER_INFO_API_PATH = '/me/permissions'
const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined)

export const NotificationsProvider = ({ children }: ChildrenProp) => {
  const [notifications, setNotifications] = useState<Notifications[]>([])

  const getNotificationRequests = async () => {
    const memberships: MembershipRequest[] = []
    const permissions = await api.get<UserPermissions>(USER_INFO_API_PATH, apiConfig)

    permissions.data?.community_scopes
      ?.filter(
        scope =>
          scope.scopes.includes('/seta/community/manager') ||
          scope.scopes.includes('/seta/community/owner')
      )
      .forEach(item => {
        community_api
          .get<MembershipRequest[]>(
            `${environment.COMMUNITIES_API_PATH}/${item.community_id}/requests`
          )
          .then(response => {
            memberships.push(...response.data)

            return response.data
          })
      })

    const invites = await community_api.get<InviteResponse[]>(`/invites/`)

    setTimeout(() => {
      const data = [
        {
          memberships: memberships,
          invites: invites.data,
          community_scopes: permissions.data?.community_scopes
        }
      ]

      setNotifications(data)
    }, 30000)

    // Allow the 100% step to be shown for a second
  }

  const value: NotificationsContextProps = {
    notifications,
    getNotificationRequests
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)

  if (context === undefined) {
    throw new Error('useNotifications must be used within an NotificationsProvider')
  }

  return context
}
