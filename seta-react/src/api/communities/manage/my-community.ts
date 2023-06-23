import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type {
  Community,
  MyCommunity,
  CommunityResponse,
  CreateCommunityAPI,
  ManageCommunityAPI,
  UpdateCommunityAPI
} from '~/api/types/community-types'
import type { ResourceResponse } from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import community_api from '../api'

export const cacheKey = (id?: string) => ['my-communities', id]

const getCommunity = async (id?: string): Promise<Community> => {
  const communities = await community_api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`
  )
  const resources = await community_api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`
  )

  const data = {
    communities: communities.data,
    resources: resources.data
  }

  return data
}

export const useCommunityID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunity(id) })

const getMyCommunity = async (id?: string): Promise<MyCommunity> => {
  const communities = await community_api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`
  )
  const resources = await community_api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`
  )

  // const invites = await community_api.get<InviteResponse[]>(
  //   `${environment.COMMUNITIES_API_PATH}/${id}/invites`
  // )

  // const members = await community_api.get<MembershipResponse[]>(
  //   `${environment.COMMUNITIES_API_PATH}/${id}/memberships`
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
  const { data } = await community_api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`
  )

  return data
}

export const useMyCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMyCommunityResources(id) })

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
        window.location.href = `/my-communities`
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
        window.location.href = `/my-communities`
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
        window.location.href = `/my-communities`
      }
    })
}
// export const useNewCommunity = (properties?: CommunityAPI) =>
//   useQuery(cacheKey(), () => createCommunity(properties))

const getCommunityResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await community_api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`
  )

  return data
}

export const useCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityResources(id) })
