import { useQuery } from '@tanstack/react-query'

import { environment } from '../../../environments/environment'
import community_api from '../api'

export type Memberships = {
  members: MembershipResponse[]
}

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
