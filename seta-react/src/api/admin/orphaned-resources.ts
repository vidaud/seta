import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

const ORPHAN_API_PATH = '/admin/orphan/resources'

const getOrphans = async (config?: AxiosRequestConfig): Promise<string[]> => {
  const { data } = await api.get<string[]>(ORPHAN_API_PATH, config)

  return data
}

export const useOrphanedResources = () => {
  return useQuery({
    queryKey: AdminQueryKeys.OphanedResourcesQueryKey,
    queryFn: ({ signal }) => getOrphans({ baseURL: environment.baseUrl, signal })
  })
}
