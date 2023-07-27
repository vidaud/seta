import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'
import type { ResourceChangeRequestValues } from '~/pages/CommunitiesPage/contexts/resource-change-request-context'

import { environment } from '../../environments/environment'
import api from '../api'
import type { ResourceChangeRequests } from '../types/change-request-types'

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

export const getPendingChangeRequests = async (): Promise<ResourceChangeRequests[]> => {
  const { data } = await api.get<ResourceChangeRequests[]>(
    `/resources/change-requests/pending`,
    apiConfig
  )

  return data
}

export const usePendingChangeRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getPendingChangeRequests() })

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

export const updateResourceChangeRequest = async (
  id?: string,
  requestId?: string,
  values?: ResourceChangeRequestValues
) => {
  await api
    .put(`/resources/${id}/change-requests/${requestId}`, values, {
      ...apiConfig,
      headers: {
        ...apiConfig?.headers,
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        // window.location.reload()
      }
    })
}
