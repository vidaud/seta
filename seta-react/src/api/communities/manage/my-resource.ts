import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type {
  CreateResourceAPI,
  ResourceResponse,
  UpdateResourceAPI
} from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import api from '../../api'

const RESOURCE_API_PATH = '/resources/'
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const cacheKey = (id?: string) => ['resources', id]
export const cacheResourceKey = () => ['resources']

export const getResource = async (id?: string): Promise<ResourceResponse> => {
  const { data } = await api.get<ResourceResponse>(`${RESOURCE_API_PATH}${id}`, apiConfig)

  return data
}

export const useResourceID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResource(id) })

const csrf_token = getCookie('csrf_access_token')

export const createResource = async (id?: string, values?: CreateResourceAPI) => {
  await api
    .post<CreateResourceAPI[]>(`${environment.COMMUNITIES_API_PATH}/${id}/resources`, values, {
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

export const updateResource = async (resource_id?: string, values?: UpdateResourceAPI) => {
  await api
    .put(`${RESOURCE_API_PATH}${resource_id}`, values, {
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
        window.location.href = `/community/resources/`
      }
    })
}

export const deleteResourceByID = async (resource_id?: string) => {
  await api
    .delete(`${RESOURCE_API_PATH}${resource_id}`, {
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
        window.location.href = `/community/resources/`
      }
    })
}
