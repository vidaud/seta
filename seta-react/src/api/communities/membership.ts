import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { MembershipValues } from '~/pages/CommunitiesPage/pages/contexts/membership-context'

import { environment } from '../../environments/environment'
import api from '../api'
import type {
  CreateMembershipRequestAPI,
  MembershipResponse,
  Memberships
} from '../types/membership-types'

export const cacheKey = (id?: string) => ['memberships', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getMembership = async (id?: string): Promise<Memberships> => {
  const members = await api
    .get<MembershipResponse[]>(`${environment.COMMUNITIES_API_PATH}/${id}/memberships`, apiConfig)
    .then(result => {
      return result
    })

  const data = {
    members: members ? members?.data : []
  }

  return data
}

export const useMembershipID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMembership(id) })

const csrf_token = getCookie('csrf_access_token')

export const createMembershipRequest = async (id?: string, values?: CreateMembershipRequestAPI) => {
  await api
    .post<CreateMembershipRequestAPI[]>(
      `${environment.COMMUNITIES_API_PATH}/${id}/requests`,
      values,
      {
        ...apiConfig,
        headers: {
          ...apiConfig?.headers,
          accept: 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        // console.log(response)
      }
    })
}

export const createOpenMembership = async (id?: string) => {
  await api
    .post<CreateMembershipRequestAPI[]>(
      `${environment.COMMUNITIES_API_PATH}/${id}/memberships`,
      null,
      {
        ...apiConfig,
        headers: {
          ...apiConfig?.headers,
          accept: 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        // console.log(response)
      }
    })
}

export const updateCommunityMembership = async (
  id?: string,
  values?: MembershipValues,
  userId?: string
) => {
  await api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, values, {
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
        window.location.reload()
      }
    })
}

export const deleteMembershipByID = async (id?: string, userId?: string) => {
  await api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, {
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
        window.location.href = `/community/communities//${id}/members`
      }
    })
}

export const leaveCommunity = async (id?: string) => {
  await api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}/membership`, {
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
        // window.location.reload()
      }
    })
}
