import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'
import type { CommunityChangeRequestValues } from '~/pages/CommunitiesPage/contexts/community-change-request-context'

import { environment } from '~/environments/environment'

import api from '../api'
import type { ChangeRequestResponse, CommunityChangeRequests } from '../types/change-request-types'

export const cacheKey = (id?: string) => ['change-requests', id]

const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getCommunityChangeRequests = async (id?: string): Promise<ChangeRequestResponse> => {
  const { data } = await api.get<ChangeRequestResponse>(
    `/communities/${id}/change-requests`,
    apiConfig
  )

  return data
}

export const useCommunityChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityChangeRequests(id) })

const csrf_token = getCookie('csrf_access_token')

export const getPendingChangeRequests = async (): Promise<CommunityChangeRequests[]> => {
  const { data } = await api.get<CommunityChangeRequests[]>(
    `/communities/change-requests/pending`,
    apiConfig
  )

  return data
}

export const usePendingChangeRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getPendingChangeRequests() })

export const createCommunityChangeRequest = async (id?: string, values?: ChangeRequestValues) => {
  await api
    .post(`${environment.COMMUNITIES_API_PATH}/${id}/change-requests`, values, {
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

export const updateCommunityChangeRequest = async (
  id?: string,
  requestId?: string,
  values?: CommunityChangeRequestValues
) => {
  await api
    .put(`/communities/${id}/change-requests/${requestId}`, values, {
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
