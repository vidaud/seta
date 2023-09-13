import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import { NotificationsType } from '~/types/community/notifications'

import { CommunityQueryKeys } from './communities/community-query-keys'

import type { NotificationsResponse } from '../types/notifications-types'

const NOTIFICATIONS_API_PATH = '/notifications/'

const getNotificationRequests = async (
  config?: AxiosRequestConfig
): Promise<NotificationsResponse[]> => {
  const { data } = await api.get<NotificationsResponse[]>(NOTIFICATIONS_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

const getTotalNotification = async (config?: AxiosRequestConfig) => {
  const result = await getNotificationRequests({ baseURL: environment.baseUrl, ...config })

  return {
    notifications: result,
    totalNotifications: result.reduce((prev, current) => {
      return prev + current.count
    }, 0),
    changeRequests: result.find(stat => stat.type === NotificationsType.ChangeRequest)?.count ?? 0,
    pendingInviteRequests:
      result.find(stat => stat.type === NotificationsType.PendingInviteRequest)?.count ?? 0,
    membershipRequests:
      result.find(stat => stat.type === NotificationsType.MembershipRequest)?.count ?? 0
  }
  // Allow the 100% step to be shown for 10 seconds
}

export const useCommunitiesNotifications = () => {
  return useQuery({
    queryKey: CommunityQueryKeys.NotificationsQueryKey,
    queryFn: ({ signal }) => getTotalNotification({ signal })
  })
}
