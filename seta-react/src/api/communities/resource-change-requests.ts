import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'
import type { ResourceChangeRequestValues } from '~/pages/CommunitiesPage/contexts/resource-change-request-context'

import community_api from './api'

import type { ResourceChangeRequests } from '../types/change-request-types'

export const cacheKey = (id?: string) => ['change-requests', id]

export const getResourcesChangeRequests = async (
  id?: string
): Promise<ResourceChangeRequests[]> => {
  const { data } = await community_api.get<ResourceChangeRequests[]>(
    `/resources/${id}/change-requests`
  )

  return data
}

export const useResourcesChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcesChangeRequests(id) })

export const getPendingChangeRequests = async (): Promise<ResourceChangeRequests[]> => {
  const { data } = await community_api.get<ResourceChangeRequests[]>(
    `/resources/change-requests/pending`
  )

  return data
}

export const usePendingChangeRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getPendingChangeRequests() })

const csrf_token = getCookie('csrf_access_token')

export const createResourceChangeRequest = async (id?: string, values?: ChangeRequestValues) => {
  await community_api
    .post(`/resources/${id}/change-requests`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.reload()
      }
    })
}

export const updateResourceChangeRequest = async (
  id?: string,
  requestId?: string,
  values?: ResourceChangeRequestValues
) => {
  await community_api
    .put(`/resources/${id}/change-requests/${requestId}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.reload()
      }
    })
}
