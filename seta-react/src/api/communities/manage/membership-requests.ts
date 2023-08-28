import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { MembershipRequestStatus } from '~/types/community/membership-requests'

import { CommunityQueryKeys } from './community-query-keys'

const REQUEST_API_PATH = (community_id: string, user_id: string): string =>
  `/communities/${community_id}/requests/${user_id}`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  community_id: string
  user_id: string
  status: MembershipRequestStatus
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
    }
  })
}
