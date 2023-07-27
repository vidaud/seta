import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { CommunityResponse } from '~/api/types/community-types'
import { environment } from '~/environments/environment'

export const cacheKey = () => ['communities']
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getCommunities = async (): Promise<CommunityResponse[]> => {
  const { data } = await api.get<CommunityResponse[]>(
    `${environment.COMMUNITIES_API_PATH}`,
    apiConfig
  )

  return data
}

export const useCommunities = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getCommunities() })
