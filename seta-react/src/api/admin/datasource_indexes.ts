import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { DatasourceIndex } from '../types/datasource-indexes-types'

export const cacheKey = () => ['data-source-indexes']
const BASE_URL = environment.baseUrl
const DATASOURCE_INDEX = (): string => '/admin/data-sources/indexes'

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getDatasourceIndexes = async (): Promise<DatasourceIndex[]> => {
  const { data } = await api.get<DatasourceIndex[]>(DATASOURCE_INDEX(), apiConfig)

  return data
}

export const useDatasourceIndexes = () =>
  useQuery({
    queryKey: AdminQueryKeys.DatasourceIndexes,
    queryFn: () => getDatasourceIndexes()
  })
