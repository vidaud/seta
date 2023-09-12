import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'

import api from '~/api/api'
import type { ResourceChangeRequests } from '~/api/types/change-request-types'
import { environment } from '~/environments/environment'

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

const csrf_token = getCookie('csrf_access_token')

export const createResourceChangeRequest = async (id?: string, values?: ChangeRequestValues) => {
  await api.post(`/resources/${id}/change-requests`, values, {
    ...apiConfig,
    headers: {
      ...apiConfig?.headers,
      accept: 'application/json',
      'X-CSRF-TOKEN': csrf_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
