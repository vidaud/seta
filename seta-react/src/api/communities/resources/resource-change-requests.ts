import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'

import api from '~/api/api'
import type { ResourceChangeRequests } from '~/api/types/change-request-types'
import { environment } from '~/environments/environment'

import { ResourceQueryKeys } from './resource-query-keys'

import { CommunityQueryKeys } from '../communities/community-query-keys'

const CHANGE_REQUEST_API_PATH = (id: string): string => `/resources/${id}/change-requests`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

export const cacheKey = (id?: string) => ['change-requests', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getResourcesChangeRequests = async (
  id?: string
): Promise<ResourceChangeRequests[]> => {
  const { data } = await api.get<ResourceChangeRequests[]>(
    `/resources/${id}/change-requests`,
    apiConfig
  )

  return data
}

export const useResourcesChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcesChangeRequests(id) })

const setChangeRequest = async (id: string, request: ChangeRequestValues) => {
  return await api.post(CHANGE_REQUEST_API_PATH(id), request, config)
}

export const useResourceChangeRequest = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: ChangeRequestValues) => setChangeRequest(id, request),
    onMutate: async () => {
      await client.cancelQueries(ResourceQueryKeys.ChangeRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(ResourceQueryKeys.ChangeRequestsQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.NotificationsQueryKey)
    }
  })
}
