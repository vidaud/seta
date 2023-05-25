import { useQuery } from '@tanstack/react-query'

import community_api from '../../communities/api'

export type ResourcesResponse = {
  resource_id: string
  community_id: string
  title: string
  abstract: string
  limits: {
    total_files_no: number
    total_storage_mb: number
    file_size_mb: number
  }
  status: string
  creator_id: string
  created_at: Date
}

const RESOURCE_API_PATH = '/resources/'

export const cacheKey = () => ['my-resources']

const getMyResources = async (): Promise<ResourcesResponse[]> => {
  const { data } = await community_api.get<ResourcesResponse[]>(`${RESOURCE_API_PATH}`)

  return data
}

export const useMyResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getMyResources() })
