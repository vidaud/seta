import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import type { UserPermissions } from '~/pages/CommunitiesPage/pages/contexts/scope-context'

import community_api from './api'

import { environment } from '../../environments/environment'
import api from '../api'
import type { InviteResponse } from '../types/invite-types'
import type { MembershipRequest } from '../types/membership-types'

type Notifications = {
  memberships: MembershipRequest[]
}

export const getNotifications = async (): Promise<Notifications> => {
  const memberships = await community_api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/membership-requests`
  )

  const invites = await community_api.get<InviteResponse[]>(`/invites/`)

  const data = {
    memberships: memberships.data,
    invites: invites.data
  }

  return data
}

const BASE_URL = environment.baseUrl
const USER_INFO_API_PATH = '/me/permissions'
const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const queryKey = {
  root: ['membership-requests']
}

export const getNotificationRequests = async (): Promise<Notifications> => {
  const permissions = await api.get<UserPermissions>(USER_INFO_API_PATH, apiConfig)
  const memberships: MembershipRequest[] = []

  permissions.data?.community_scopes
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
          memberships.push(...response.data)

          return response.data
        })
    })

  const data = {
    memberships: memberships
  }

  return data
}

export const useNotificationsRequests = () =>
  useQuery({
    queryKey: queryKey.root,
    queryFn: () => getNotificationRequests()
  })
