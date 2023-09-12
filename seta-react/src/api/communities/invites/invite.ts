import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { CreateInvitationAPI, InviteResponse } from '~/api/types/invite-types'
import { environment } from '~/environments/environment'

import { CommunityQueryKeys } from '../communities/community-query-keys'

const INVITE_API_PATH = (id: string): string => `/communities/${id}/invites`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

export const cacheKey = (id?: string) => ['invites', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getInvite = async (id?: string): Promise<InviteResponse[]> => {
  const { data } = await api.get<InviteResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/invites`,
    apiConfig
  )

  return data
}

export const useInviteID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getInvite(id) })

const setNewCommunityInvite = async (id: string, request: CreateInvitationAPI) => {
  return await api.post(INVITE_API_PATH(id), request, config)
}

export const useNewCommunityInvite = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateInvitationAPI) => setNewCommunityInvite(id, request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.InvitationsRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.InvitationsRequestsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

export const cacheNoIDKey = () => ['invites']

export const pendingInvites = async (): Promise<InviteResponse[]> => {
  const { data } = await api.get<InviteResponse[]>(`/invites/`, apiConfig)

  return data
}

export const useAllPendingInvites = () =>
  useQuery({ queryKey: cacheNoIDKey(), queryFn: () => pendingInvites() })
