import { useQuery } from '@tanstack/react-query'

import community_api from '../../communities/api'
import type { ResourcesResponse } from '../manage/my-resources'

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

export const cacheKey = () => ['resources']

const getAllResources = async (): Promise<ResourcesResponse[]> => {
  const { data } = await community_api.get<ResourcesResponse[]>(`/discover/resources`)

  return data
}

export const useAllResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllResources() })
