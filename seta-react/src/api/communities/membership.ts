import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { MembershipValues } from '~/pages/CommunitiesPage/contexts/membership-context'

import community_api from './api'

import { environment } from '../../environments/environment'
import type {
  CreateMembershipRequestAPI,
  MembershipResponse,
  Memberships
} from '../types/membership-types'

export const cacheKey = (id?: string) => ['memberships', id]

export const getMembership = async (id?: string): Promise<Memberships> => {
  const members = await community_api
    .get<MembershipResponse[]>(`${environment.COMMUNITIES_API_PATH}/${id}/memberships`)
    .then(result => {
      return result
    })
    .catch(e => {
      // console.log(e)
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
  await community_api
    .post<CreateMembershipRequestAPI[]>(
      `${environment.COMMUNITIES_API_PATH}/${id}/requests`,
      values,
      {
        headers: {
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
  await community_api
    .post<CreateMembershipRequestAPI[]>(
      `${environment.COMMUNITIES_API_PATH}/${id}/memberships`,
      null,
      {
        headers: {
          accept: 'application/json',
          'X-CSRF-TOKEN': csrf_token
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
  await community_api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, values, {
      headers: {
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
  await community_api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = `/my-communities/${id}/members`
      }
    })
}
