import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import type { ResourceResponse } from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import api from '../../api'

const RESOURCE_API_PATH = '/resources/'
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const cacheKey = () => ['resources']

const getMyResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(`${RESOURCE_API_PATH}`, apiConfig)

  return data
}

export const useMyResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getMyResources() })
