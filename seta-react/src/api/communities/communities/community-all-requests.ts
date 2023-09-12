import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { ChangeRequestResponse } from '~/api/types/change-request-types'
import type { InviteResponse } from '~/api/types/invite-types'
import type { MembershipRequest } from '~/api/types/membership-types'
import type { UserPermissionsResponse } from '~/api/types/user-permissions-types'
import { environment } from '~/environments/environment'

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
