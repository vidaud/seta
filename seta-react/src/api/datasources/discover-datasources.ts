import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { DatasourcesResponse } from '~/api/types/datasource-types'
import { environment } from '~/environments/environment'

export const cacheKey = () => ['data-sources']
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getAllDatasources = async (): Promise<DatasourcesResponse[]> => {
  const { data } = await api.get<DatasourcesResponse[]>(`/data-sources`, apiConfig)

  return data
}

export const useAllDatasources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllDatasources() })
