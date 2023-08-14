import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { Community } from '~/types/admin/community'

import { AdminQueryKeys } from './query-keys'

const ORPHAN_API_PATH = '/admin/orphan/communities'

const getOrphans = async (config?: AxiosRequestConfig): Promise<Community[]> => {
  const { data } = await api.get<Community[]>(ORPHAN_API_PATH, config)

  return data
}

export const useOrphanedCommunities = () => {
  return useQuery({
    queryKey: AdminQueryKeys.OphanedCommunitiesQueryKey,
    queryFn: ({ signal }) => getOrphans({ baseURL: environment.baseUrl, signal })
  })
}

const COMMUNITY_OWNER_API_PATH = (community_id: string): string =>
  `/admin/orphan/communities/${community_id}`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  communityId: string
  userId: string
}

const setCommunityOwner = async (request: Request) => {
  return await api.post(
    COMMUNITY_OWNER_API_PATH(request.communityId),
    { owner: request.userId },
    config
  )
}

export const useSetCommunityOwner = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => setCommunityOwner(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.OphanedCommunitiesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.OphanedCommunitiesQueryKey)
      client.invalidateQueries(AdminQueryKeys.SidebarQueryKey)
    }
  })
}
