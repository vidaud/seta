import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { ChangeMembershipRequestStatus } from '~/types/community/change-membership-requests'

import { CommunityQueryKeys } from './community-query-keys'

const REQUEST_API_PATH = (community_id: string): string =>
  `/communities/${community_id}/change-requests`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  community_id: string
  field_name: string
  new_value: ChangeMembershipRequestStatus
  old_value: string
}

const setPendingChangeMembershipRequest = async (request: Request) => {
  return await api.post(
    REQUEST_API_PATH(request.community_id),
    { field_name: request.field_name, new_value: request.new_value, old_value: request.old_value },
    config
  )
}

export const useSetChangeMembershipRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => setPendingChangeMembershipRequest(request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.MembershipChangeRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.MembershipChangeRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}
