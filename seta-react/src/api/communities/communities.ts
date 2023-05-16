import { useQuery } from '@tanstack/react-query'

import community_api from './api'

import { environment } from '../../environments/environment'

export type CommunitiesResponse = {
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

export const cacheKey = () => ['communities']

const getCommunities = async (): Promise<CommunitiesResponse[]> => {
  const { data } = await community_api.get<CommunitiesResponse[]>(
    `${environment.COMMUNITIES_API_PATH}`
  )

  return data
}

export const useCommunities = () => useQuery(cacheKey(), () => getCommunities())
