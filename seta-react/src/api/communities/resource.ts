import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

const COMMUNITIES_API_PATH = '/communities/'

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

export const cacheKey = (id?: string) => ['communities', id]

export const getResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await community_api.get<ResourceResponse[]>(
    `${COMMUNITIES_API_PATH}${id}/resources`
  )

  return data
}

export const useResourceID = (id?: string) => useQuery(cacheKey(id), () => getResources(id))

const csrf_token = getCookie('csrf_access_token')

export const createResource = async (id?: string, values?: CreateResourceAPI) => {
  await community_api
    .post<CreateResourceAPI[]>(`${COMMUNITIES_API_PATH}${id}/resources`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        window.location.href = `/communities/details/${id}`
      }
    })
    .catch(error => {
      console.log(error)
    })
}
