import { useQuery } from '@tanstack/react-query'

import type { ResourceResponse } from '~/api/types/resource-types'

import community_api from '../../communities/api'

export const cacheKey = () => ['resources']

const getAllResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await community_api.get<ResourceResponse[]>(`/discover/resources`)

  return data
}

export const useAllResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllResources() })
