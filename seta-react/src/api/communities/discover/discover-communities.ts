import { useQuery } from '@tanstack/react-query'

import type { CommunityResponse } from '~/api/types/community-types'

import { environment } from '../../../environments/environment'
import community_api from '../api'

export const cacheKey = () => ['communities']

const getAllCommunities = async (): Promise<CommunityResponse[]> => {
  const { data } = await community_api.get<CommunityResponse[]>(
    `/discover${environment.COMMUNITIES_API_PATH}`
  )

  return data
}

export const useAllCommunities = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllCommunities() })
