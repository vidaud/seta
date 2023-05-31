import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

import { environment } from '../../environments/environment'

export type MembershipResponse = {
  community_id: string
  user_id: string
  role: string
  join_date: Date
  status: string
}

export type CreateMembershipAPI = {
  community_id: string
}

export type CreateMembershipRequestAPI = {
  community_id: string
  message: string
}

export const cacheKey = (id?: string) => ['memberships', id]

export const getMembership = async (id?: string): Promise<MembershipResponse[]> => {
  const { data } = await community_api.get<MembershipResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/memberships`
  )

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
