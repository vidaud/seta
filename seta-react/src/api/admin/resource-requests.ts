import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { ResourceChangeRequest, RequestStatus } from '~/types/admin/change-requests'

import { AdminQueryKeys } from './query-keys'

const RESOUCE_REQUESTS_API_PATH = '/admin/resources/change-requests'

const getPendingRequests = async (
  config?: AxiosRequestConfig
): Promise<ResourceChangeRequest[]> => {
  const { data } = await api.get<ResourceChangeRequest[]>(RESOUCE_REQUESTS_API_PATH, config)

  return data
}

export const useResourcePendingRequests = () => {
  return useQuery({
    queryKey: AdminQueryKeys.ResourceRequestsQueryKey,
    queryFn: ({ signal }) => getPendingRequests({ baseURL: environment.baseUrl, signal })
  })
}

const REQUEST_API_PATH = (resource_id: string, request_id: string): string =>
  `/admin/resources/${resource_id}/change-requests/${request_id}`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

type Request = {
  resourceId: string
  requestId: string
  status: RequestStatus
}

const updatePendingRequest = async (request: Request) => {
  return await api.put(
    REQUEST_API_PATH(request.resourceId, request.requestId),
    { status: request.status },
    config
  )
}

export const useUpdateResourceRequest = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => updatePendingRequest(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.ResourceRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.ResourceRequestsQueryKey)
      client.invalidateQueries(AdminQueryKeys.SidebarQueryKey)
    }
  })
}
