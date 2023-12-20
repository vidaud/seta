import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { DatasourceScope } from '../types/datasource-scopes-types'

export const cacheKey = (user_id: string) => [`data-sources/${user_id}/scopes`]
const BASE_URL = environment.baseUrl
const DATASOURCE_SCOPES_API_PATH = (user_id): string => `/admin/data-sources/${user_id}/scopes`

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const setAssignScope = async (request: DatasourceScope[], datasource_id: string) => {
  return await api.post(DATASOURCE_SCOPES_API_PATH(datasource_id), { scopes: request }, apiConfig)
}

export const useAssignScope = (datasource_id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: DatasourceScope[]) => setAssignScope(request, datasource_id),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.DatasourceScopes)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.DatasourceScopes)
      client.invalidateQueries(AdminQueryKeys.Datasources)
    }
  })
}
