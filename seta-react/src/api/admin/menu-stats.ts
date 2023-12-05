import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { LightStatsResponse } from '~/types/admin/stats'

import { AdminQueryKeys } from './query-keys'

const STATS_LIGHT_API_PATH = '/admin/stats/light'

const getStatsLight = async (config?: AxiosRequestConfig): Promise<LightStatsResponse[]> => {
  const { data } = await api.get<LightStatsResponse[]>(STATS_LIGHT_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useAdminStatsLight = () => {
  return useQuery({
    queryKey: AdminQueryKeys.LightStats,
    queryFn: ({ signal }) => getStatsLight({ signal })
  })
}
