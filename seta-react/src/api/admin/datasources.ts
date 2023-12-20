import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { CreateDatasource, DatasourceResponse } from '../types/datasource-types'

export const cacheKey = () => ['data-sources']
const BASE_URL = environment.baseUrl
const DATASOURCES = (): string => '/admin/data-sources'
const DATASOURCES_API_PATH = (id): string => `/admin/data-sources/${id}`

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getDatasources = async (): Promise<DatasourceResponse[]> => {
  const { data } = await api.get<DatasourceResponse[]>(DATASOURCES(), apiConfig)

  return data
}

export const useDatasources = () =>
  useQuery({ queryKey: AdminQueryKeys.Datasources, queryFn: () => getDatasources() })

export const setCreateDatasource = async (request: CreateDatasource) => {
  return await api.post(DATASOURCES(), request, apiConfig)
}

export const useCreateDatasource = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateDatasource) => setCreateDatasource(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Datasources)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Datasources)
    }
  })
}

const updateDatasource = async (request: DatasourceResponse, id: string) => {
  return await api.put(DATASOURCES_API_PATH(id), request, apiConfig)
}

export const useUpdateDatasource = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: DatasourceResponse) => updateDatasource(request, id),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Datasources)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Datasources)
    }
  })
}
