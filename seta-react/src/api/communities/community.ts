import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

const COMMUNITIES_API_PATH = '/communities/'

export type CommunityResponse = {
  community_id: string
  title: string
  description: string
  data_type: string
  status: string
}

export type CreateCommunityAPI = {
  community_id: string
  title: string
  description?: string
  data_type: string
}

export type UpdateCommunityAPI = {
  community_id: string
  title: string
  description: string
  data_type: string
  status: string
}

export type ManageCommunityAPI = {
  community_id: string
  title: string
  description: string
  membership: string
  data_type: string
  status: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
  created_at: Date
}

export const cacheKey = (id?: string) => ['communities', id]

const getCommunity = async (id?: string): Promise<CommunityResponse> => {
  const { data } = await community_api.get<CommunityResponse>(`${COMMUNITIES_API_PATH}${id}`)

  return data
}

export const useCommunityID = (id?: string) => useQuery(cacheKey(id), () => getCommunity(id))

const getCommunityManage = async (id?: string): Promise<ManageCommunityAPI> => {
  const { data } = await community_api.get<ManageCommunityAPI>(`${COMMUNITIES_API_PATH}${id}`)

  return data
}

export const useCommunityManagement = (id?: string) =>
  useQuery(cacheKey(id), () => getCommunityManage(id))

const csrf_token = getCookie('csrf_access_token')

export const createCommunity = async (values?: CreateCommunityAPI) => {
  await community_api
    .post<CreateCommunityAPI[]>(`${COMMUNITIES_API_PATH}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        window.location.href = '/communities/my-list'
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export const updateCommunity = async (id?: string, values?: UpdateCommunityAPI) => {
  await community_api
    .put(`${COMMUNITIES_API_PATH}${id}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = '/communities/my-list'
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export const deleteCommunityByID = async (id?: string) => {
  await community_api
    .delete(`${COMMUNITIES_API_PATH}${id}`, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = '/communities/my-list'
      }
    })
    .catch(error => {
      console.log(error)
    })
}

// export const useNewCommunity = (properties?: CommunityAPI) =>
//   useQuery(cacheKey(), () => createCommunity(properties))
