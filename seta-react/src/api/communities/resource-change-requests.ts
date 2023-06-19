import { useQuery } from '@tanstack/react-query'

import community_api from './api'

import type { ResourceChangeRequests } from '../types/change-request-types'

export const cacheKey = (id?: string) => ['change-requests', id]

export const getResourcesChangeRequests = async (
  id?: string
): Promise<ResourceChangeRequests[]> => {
  const { data } = await community_api.get<ResourceChangeRequests[]>(
    `/resources/${id}/change-requests`
  )

  console.log(data)

  return data
}

export const useResourcesChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcesChangeRequests(id) })
