import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import api from '~/api/api'
import type {
  CommunityResponse,
  CreateCommunityAPI,
  UpdateCommunityAPI
} from '~/api/types/community-types'
import type { ResourceResponse } from '~/api/types/resource-types'
import { environment } from '~/environments/environment'

export const cacheKey = (id?: string) => ['communities', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getCommunity = async (id?: string): Promise<CommunityResponse> => {
  const { data } = await api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`,
    apiConfig
  )

  return data
}

export const useCommunityID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunity(id) })

const getMyCommunityResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`,
    apiConfig
  )

  return data
}

export const useMyCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMyCommunityResources(id) })

const csrf_token = getCookie('csrf_access_token')

export const createCommunity = async (values?: CreateCommunityAPI) => {
  await api
    .post<CreateCommunityAPI[]>(`${environment.COMMUNITIES_API_PATH}`, values, {
      ...apiConfig,
      headers: {
        ...apiConfig?.headers,
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        window.location.href = `/community/communities/`
      }
    })
}

export const updateCommunity = async (id?: string, values?: UpdateCommunityAPI) => {
  await api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}`, values, {
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
        window.location.href = `/community/communities/`
      }
    })
}

export const deleteCommunityByID = async (id?: string) => {
  await api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}`, {
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
        window.location.href = `/community/communities/`
      }
    })
}
