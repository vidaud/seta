import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type {
  MyCommunity,
  CommunityResponse,
  CreateCommunityAPI,
  ManageCommunityAPI,
  UpdateCommunityAPI
} from '~/api/types/community-types'
import type { ResourceResponse } from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import api from '../../api'

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

const getMyCommunity = async (id?: string): Promise<MyCommunity> => {
  const communities = await api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`,
    apiConfig
  )
  const resources = await api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`,
    apiConfig
  )

  // const invites = await api.get<InviteResponse[]>(
  //   `${environment.COMMUNITIES_API_PATH}/${id}/invites`, apiConfig
  // )

  // const members = await api.get<MembershipResponse[]>(
  //   `${environment.COMMUNITIES_API_PATH}/${id}/memberships`, apiConfig
  // )

  const data = {
    communities: communities.data,
    resources: resources.data
    // invites: invites.data,
    // members: members.data
  }

  return data
}

export const useMyCommunityID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMyCommunity(id) })

const getMyCommunityResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`,
    apiConfig
  )

  return data
}

export const useMyCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMyCommunityResources(id) })

const getCommunityManage = async (id?: string): Promise<ManageCommunityAPI> => {
  const { data } = await api.get<ManageCommunityAPI>(
    `${environment.COMMUNITIES_API_PATH}/${id}`,
    apiConfig
  )

  return data
}

export const useCommunityManagement = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityManage(id) })

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
        window.location.href = `/communities`
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
        window.location.href = `/communities`
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
        window.location.href = `/communities`
      }
    })
}
// export const useNewCommunity = (properties?: CommunityAPI) =>
//   useQuery(cacheKey(), () => createCommunity(properties))

const getCommunityResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`,
    apiConfig
  )

  return data
}

export const useCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityResources(id) })
