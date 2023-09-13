import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import api from '~/api/api'
import type {
  CreateResourceAPI,
  ResourceResponse,
  UpdateResourceAPI
} from '~/api/types/resource-types'
import { environment } from '~/environments/environment'

import { ResourceQueryKeys } from './resource-query-keys'

const RESOURCE_API_PATH = '/resources/'
const UPDATE_RESOURCE_API_PATH = (id: string): string => `/resources/${id}`
const DELETE_RESOURCE_API_PATH = (id: string): string => `/resources/${id}`
const csrf_token = getCookie('csrf_access_token')
const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    'X-CSRF-TOKEN': csrf_token
  }
}

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

export const setUpdateResource = async (id: string, request?: UpdateResourceAPI) => {
  return await api.put(UPDATE_RESOURCE_API_PATH(id), request, config)
}

export const useSetUpdateResource = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateResourceAPI) => setUpdateResource(id, request),
    onMutate: async () => {
      await client.cancelQueries(ResourceQueryKeys.ResourcesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
    }
  })
}

export const deleteResourceByID = async (resource_id?: string) => {
  await api.delete(`${RESOURCE_API_PATH}${resource_id}`, {
    ...apiConfig,
    headers: {
      ...apiConfig?.headers,
      accept: 'application/json',
      'X-CSRF-TOKEN': csrf_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const setDeleteResource = async (id: string) => {
  return await api.delete(DELETE_RESOURCE_API_PATH(id), config)
}

export const useDeleteResource = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteResource(id),
    onMutate: async () => {
      await client.cancelQueries(ResourceQueryKeys.ResourcesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
    }
  })
}