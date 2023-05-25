import { useQuery } from '@tanstack/react-query'

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

export const cacheKey = (id?: string) => ['my-communities', id]

export const getMembership = async (id?: string): Promise<MembershipResponse[]> => {
  const { data } = await community_api.get<MembershipResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/memberships`
  )

  return data
}

export const useMembershipID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMembership(id) })
