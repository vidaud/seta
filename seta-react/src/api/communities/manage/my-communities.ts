import { useQuery } from '@tanstack/react-query'

import type { CommunityResponse } from '~/api/types/community-types'

import { environment } from '../../../environments/environment'
import community_api from '../api'

export const cacheKey = () => ['communities']

const getCommunities = async (): Promise<CommunityResponse[]> => {
  const { data } = await community_api.get<CommunityResponse[]>(
    `${environment.COMMUNITIES_API_PATH}`
  )

  return data
}

export const useCommunities = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getCommunities() })
