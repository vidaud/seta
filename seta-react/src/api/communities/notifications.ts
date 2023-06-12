import { useQuery } from '@tanstack/react-query'

import community_api from './api'

import { environment } from '../../environments/environment'
import type { InviteResponse } from '../types/invite-types'
import type { MembershipRequest } from '../types/membership-types'

export const cacheKey = () => ['']

type Notifications = {
  memberships: MembershipRequest[]
  invites: InviteResponse[]
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

export const useNotificationsRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getNotifications() })
