import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import { StatsType } from '~/types/stats/stats'
import type { LightStatsResponse, SidebarStats } from '~/types/stats/stats'

const STATS_LIGHT_API_PATH = '/admin/stats/light'

const getStatsLight = async (config?: AxiosRequestConfig): Promise<LightStatsResponse[]> => {
  const { data } = await api.get<LightStatsResponse[]>(STATS_LIGHT_API_PATH, config)

  return data
}

const getMenuStats = async (config?: AxiosRequestConfig): Promise<SidebarStats> => {
  const data = await getStatsLight(config)

  return {
    totalChangeRequests: data
      .filter(
        stat =>
          stat.type === StatsType.CommunityChangeRequest ||
          stat.type === StatsType.ResourceChangeRequest
      )
      .reduce((prev, current) => {
        return prev + current.count
      }, 0),
    communityChangeRequests:
      data.find(stat => stat.type === StatsType.CommunityChangeRequest)?.count ?? 0,
    resourceChangeRequests:
      data.find(stat => stat.type === StatsType.ResourceChangeRequest)?.count ?? 0,
    totalOrphans: data
      .filter(
        stat =>
          stat.type === StatsType.OrphanedCommunities || stat.type === StatsType.OrphanedResources
      )
      .reduce((prev, current) => {
        return prev + current.count
      }, 0),
    orphanedCommunities: data.find(stat => stat.type === StatsType.OrphanedCommunities)?.count ?? 0,
    orphanedResources: data.find(stat => stat.type === StatsType.OrphanedResources)?.count ?? 0
  }
}

export const useAdminSidebarStats = () => {
  return useQuery({
    queryKey: ['sidebar-stats'],
    queryFn: ({ signal }) => getMenuStats({ baseURL: environment.baseUrl, signal })
  })
}

export const useAdminStatsLight = () => {
  return useQuery({
    queryKey: ['stats-light'],
    queryFn: ({ signal }) => getStatsLight({ baseURL: environment.baseUrl, signal })
  })
}
