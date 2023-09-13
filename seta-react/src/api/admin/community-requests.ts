import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { CommunityChangeRequest, RequestStatus } from '~/types/admin/change-requests'

import { AdminQueryKeys } from './query-keys'

import { CommunityQueryKeys } from '../communities/communities/community-query-keys'

const COMMUNITY_REQUESTS_API_PATH = '/admin/communities/change-requests'

const getPendingRequests = async (
  config?: AxiosRequestConfig
): Promise<CommunityChangeRequest[]> => {
  const { data } = await api.get<CommunityChangeRequest[]>(COMMUNITY_REQUESTS_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useCommunityPendingRequests = () => {
  return useQuery({
    queryKey: AdminQueryKeys.CommunityRequestsQueryKey,
    queryFn: ({ signal }) => getPendingRequests({ signal })
  })
}

const COMMUNITY_REQUEST_API_PATH = (community_id: string, request_id: string): string =>
  `/admin/communities/${community_id}/change-requests/${request_id}`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  communityId: string
  requestId: string
  status: RequestStatus
}

const updatePendingRequest = async (request: Request) => {
  return await api.put(
    COMMUNITY_REQUEST_API_PATH(request.communityId, request.requestId),
    { status: request.status },
    config
  )
}

export const useUpdateCommunityRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => updatePendingRequest(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.CommunityRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.CommunityRequestsQueryKey)
      client.invalidateQueries(AdminQueryKeys.SidebarQueryKey)
      client.invalidateQueries(CommunityQueryKeys.MembershipChangeRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.NotificationsQueryKey)
    }
  })
}
