import { useQuery } from '@tanstack/react-query'

import type { ResourceResponse } from '~/api/types/resource-types'

import community_api from '../../communities/api'

const RESOURCE_API_PATH = '/resources/'

export const cacheKey = () => ['my-resources']

const getMyResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await community_api.get<ResourceResponse[]>(`${RESOURCE_API_PATH}`)

  return data
}

export const useMyResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getMyResources() })
