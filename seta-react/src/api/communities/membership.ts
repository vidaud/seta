import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

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
      console.log(e)
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
