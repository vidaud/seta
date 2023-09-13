import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { InviteRequestStatus } from '~/types/community/invite-requests'

import { CommunityQueryKeys } from '../communities/community-query-keys'

const REQUEST_API_PATH = (invite_id: string): string => `/invites/${invite_id}`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  invite_id: string
  status: InviteRequestStatus
}

const updatePendingInvitesRequest = async (request: Request) => {
  return await api.put(REQUEST_API_PATH(request.invite_id), { status: request.status }, config)
}

export const useUpdateInvitationRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => updatePendingInvitesRequest(request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.InvitationsRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.InvitationsRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.NotificationsQueryKey)
    }
  })
}
