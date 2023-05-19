import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import { environment } from '../../../environments/environment'
import type { ResourceResponse } from '../../resources/manage/my-resource'
import community_api from '../api'
import type { InviteResponse } from '../invite'

export type CommunityResponse = {
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

export type Community = {
  communities: CommunityResponse
  resources: ResourceResponse[]
  invites: InviteResponse[]
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

const getCommunity = async (id?: string): Promise<Community> => {
  const communities = await community_api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`
  )
  const resources = await community_api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`
  )

  const invites = await community_api.get<InviteResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/invites`
  )

  const data = {
    communities: communities.data,
    resources: resources.data,
    invites: invites.data
  }

  return data
}

export const useCommunityID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunity(id) })

const getCommunityManage = async (id?: string): Promise<ManageCommunityAPI> => {
  const { data } = await community_api.get<ManageCommunityAPI>(
    `${environment.COMMUNITIES_API_PATH}/${id}`
  )

  return data
}

export const useCommunityManagement = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityManage(id) })

const csrf_token = getCookie('csrf_access_token')

export const createCommunity = async (values?: CreateCommunityAPI) => {
  await community_api
    .post<CreateCommunityAPI[]>(`${environment.COMMUNITIES_API_PATH}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        console.log(environment.COMMUNITIES_API_PATH)
        window.location.href = `${environment.COMMUNITIES_API_PATH}/my-list`
      }
    })
}

export const updateCommunity = async (id?: string, values?: UpdateCommunityAPI) => {
  await community_api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `${environment.COMMUNITIES_API_PATH}/my-list`
      }
    })
}

export const deleteCommunityByID = async (id?: string) => {
  await community_api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}`, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `${environment.COMMUNITIES_API_PATH}/my-list'`
      }
    })
}
// export const useNewCommunity = (properties?: CommunityAPI) =>
//   useQuery(cacheKey(), () => createCommunity(properties))
