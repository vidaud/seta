import { createContext, useContext, useEffect, useState } from 'react'
import type { AxiosRequestConfig } from 'axios'

import type { MembershipRequest } from '~/api/types/membership-types'
import type { ChildrenProp } from '~/types/children-props'

import type { UserPermissions } from './scope-context'

import api from '../../../../api/api'
import community_api from '../../../../api/communities/api'
import { environment } from '../../../../environments/environment'
import useIsMounted from '../../../../hooks/use-is-mounted'

export type NotificationsResponse = {
  label: string
  description: string
  count: number
  type: string
  priority: number
}

type NotificationsContextProps = {
  notifications: NotificationsResponse[]
  total: number
  permissions?: UserPermissions
  memberships: MembershipRequest[]
  getNotificationRequests: () => void
  getMembershipRequests: () => Promise<MembershipRequest[]>
  getPermissions: () => Promise<UserPermissions>
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined)

export const NotificationsProvider = ({ children }: ChildrenProp) => {
  const [notifications, setNotifications] = useState<NotificationsResponse[]>([])
  const [permissions, setPermissions] = useState<UserPermissions | undefined>()
  const [memberships, setMemberships] = useState<MembershipRequest[]>([])
  const [total, setTotal] = useState(0)
  const isMounted = useIsMounted()

  useEffect(() => {
    let timeout: number | null = null

    if (isMounted()) {
      timeout = setTimeout(() => {
        if (notifications) {
          getNotificationRequests().then(response => {
            setNotifications(response.data)
          })
        }
      }, 3000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [isMounted, notifications])

  useEffect(() => {
    getPermissions().then(response => {
      setPermissions(response)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const BASE_URL = environment.baseUrl
  const apiConfig: AxiosRequestConfig = {
    baseURL: BASE_URL
  }

  const getPermissions = async (): Promise<UserPermissions> => {
    const { data } = await api.get<UserPermissions>('/me/permissions', apiConfig)

    setPermissions(data)

    return data
  }

  const getMembershipRequests = async (): Promise<MembershipRequest[]> => {
    const list: MembershipRequest[] = []

    permissions?.community_scopes
      ?.filter(
        scope =>
          scope.scopes.includes('/seta/community/manager') ||
          scope.scopes.includes('/seta/community/owner')
      )
      .forEach(async item => {
        await community_api
          .get<MembershipRequest[]>(
            `${environment.COMMUNITIES_API_PATH}/${item.community_id}/requests`
          )
          .then(response => {
            list.push(...response.data)

            return response.data
          })
      })

    setMemberships(list)

    return list
  }

  const getNotificationRequests = async () => {
    let count = 0
    const result = await community_api.get<NotificationsResponse[]>(`/notifications/`)

    result.data.forEach(element => {
      count += element.count
    })

    setTotal(count)

    return result
    // Allow the 100% step to be shown for a second
  }

  const value: NotificationsContextProps = {
    notifications,
    total,
    permissions,
    memberships,
    getNotificationRequests,
    getMembershipRequests,
    getPermissions
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
