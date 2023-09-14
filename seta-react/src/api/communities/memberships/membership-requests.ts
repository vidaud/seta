import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '~/api'
import { AdminQueryKeys } from '~/api/admin/query-keys'
import type { MembershipRequest } from '~/api/types/membership-types'
import { environment } from '~/environments/environment'
import type { ChangeMembershipRequestStatus } from '~/types/community/change-membership-requests'
import type { MembershipRequestStatus } from '~/types/community/membership-requests'

import { CommunityQueryKeys } from '../communities/community-query-keys'

const REQUEST_API_PATH = (community_id: string, user_id: string): string =>
  `/communities/${community_id}/requests/${user_id}`
const UPDATE_REQUEST_API_PATH = (community_id: string): string =>
  `/communities/${community_id}/change-requests`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

export const cacheKey = (id?: string) => ['requests', id]

type Request = {
  community_id: string
  user_id: string
  status: MembershipRequestStatus
}

type UpdateRequest = {
  community_id: string
  field_name: string
  new_value: ChangeMembershipRequestStatus
  old_value: string
}

const updatePendingMembershipRequest = async (request: Request) => {
  return await api.put(
    REQUEST_API_PATH(request.community_id, request.user_id),
    { status: request.status },
    config
  )
}

export const useUpdateMembershipRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => updatePendingMembershipRequest(request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.MembershipRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.MembershipRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.NotificationsQueryKey)
    }
  })
}

const setPendingChangeMembershipRequest = async (request: UpdateRequest) => {
  return await api.post(
    UPDATE_REQUEST_API_PATH(request.community_id),
    { field_name: request.field_name, new_value: request.new_value, old_value: request.old_value },
    config
  )
}

export const useSetChangeMembershipRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateRequest) => setPendingChangeMembershipRequest(request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.MembershipChangeRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.MembershipChangeRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.NotificationsQueryKey)
      client.invalidateQueries(AdminQueryKeys.SidebarQueryKey)
      client.invalidateQueries(AdminQueryKeys.CommunityRequestsQueryKey)
    }
  })
}

export const getAllMembershipRequests = async (): Promise<MembershipRequest[]> => {
  const { data } = await api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/requests`,
    config
  )

  return data
}

export const useMembershipRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllMembershipRequests() })
