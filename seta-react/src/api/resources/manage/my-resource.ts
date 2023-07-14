import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type {
  CreateResourceAPI,
  ResourceResponse,
  UpdateResourceAPI
} from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import community_api from '../../communities/api'

const RESOURCE_API_PATH = '/resources/'

export const cacheKey = (id?: string) => ['resources', id]
export const cacheResourceKey = () => ['resources']

export const getResource = async (id?: string): Promise<ResourceResponse> => {
  const { data } = await community_api.get<ResourceResponse>(`${RESOURCE_API_PATH}${id}`)

  return data
}

export const useResourceID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResource(id) })

const csrf_token = getCookie('csrf_access_token')

export const createResource = async (id?: string, values?: CreateResourceAPI) => {
  await community_api
    .post<CreateResourceAPI[]>(`${environment.COMMUNITIES_API_PATH}/${id}/resources`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        window.location.href = `/communities`
      }
    })
}

export const updateResource = async (resource_id?: string, values?: UpdateResourceAPI) => {
  await community_api
    .put(`${RESOURCE_API_PATH}${resource_id}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `/resources/`
      }
    })
}

export const updateCommunityResource = async (
  id?: string,
  resource_id?: string,
  values?: UpdateResourceAPI
) => {
  await community_api
    .put(`${RESOURCE_API_PATH}${resource_id}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `/communities/${id}`
      }
    })
}

export const deleteResourceByID = async (resource_id?: string) => {
  await community_api
    .delete(`${RESOURCE_API_PATH}${resource_id}`, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `/resources/`
      }
    })
}
