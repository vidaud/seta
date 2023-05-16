import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

import { environment } from '../../environments/environment'

const RESOURCE_API_PATH = '/resources/'

export type ResourceResponse = {
  community_id: string
  resource_id: string
  title: string
  abstract: string
  access: string
  limits: {
    total_files_no: number
    total_storage_mb: number
    file_size_mb: number
  }
  status: string
  creator_id: string
  created_at: Date
}

export type CreateResourceAPI = {
  community_id: string
  resource_id: string
  title: string
  abstract: string
}

export type UpdateResourceAPI = {
  community_id: string
  resource_id: string
  title: string
  abstract: string
}

export type CreateInvitationAPI = {
  email: string[]
  message: string
}

export const cacheKey = (id?: string) => ['resources', id]

export const getResource = async (id?: string): Promise<ResourceResponse> => {
  const { data } = await community_api.get<ResourceResponse>(`${RESOURCE_API_PATH}${id}`)

  return data
}

export const useResourceID = (id?: string) => useQuery(cacheKey(id), () => getResource(id))

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
        window.location.href = `${environment.COMMUNITIES_API_PATH}/details/${id}`
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export const updateResource = async (
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
        window.location.href = `/communities/details/${id}`
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export const deleteResourceByID = async (id?: string, resource_id?: string) => {
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
        window.location.href = `/communities/details/${id}`
      }
    })
    .catch(error => {
      console.log(error)
    })
}
