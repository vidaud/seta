import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import api from '../api'
import type { ChangeRequestResponse } from '../types/change-request-types'
import type { InviteResponse } from '../types/invite-types'
import type { MembershipRequest } from '../types/membership-types'
import type { UserPermissionsResponse } from '../types/user-permissions-types'

export const cacheKey = (id?: string) => ['requests', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

type DataResponse = {
  memberships: MembershipRequest[]
  invites: InviteResponse[]
  userPermissions: UserPermissionsResponse[]
  changeRequests: ChangeRequestResponse
}

export const getAllCommunityRequests = async (id?: string): Promise<DataResponse> => {
  const memberships = await api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/requests`,
    apiConfig
  )

  const invites = await api.get<InviteResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/invites`,
    apiConfig
  )

  const userPermissions = await api.get<UserPermissionsResponse[]>(
    `/permissions/community/${id}`,
    apiConfig
  )

  const changeRequests = await api.get<ChangeRequestResponse>(
    `/communities/${id}/change-requests`,
    apiConfig
  )

  const data = {
    memberships: memberships.data,
    invites: invites.data,
    userPermissions: userPermissions.data,
    changeRequests: changeRequests.data
  }

  return data
}

export const useAllCommunityRequestsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getAllCommunityRequests(id) })
