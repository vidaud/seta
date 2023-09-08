import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { ResourceResponse } from '~/api/types/resource-types'
import { environment } from '~/environments/environment'

export const cacheKey = () => ['resources']
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getAllResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(`/discover/resources`, apiConfig)

  return data
}

export const useAllResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllResources() })
