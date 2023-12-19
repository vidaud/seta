import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import api from '~/api/api'
import { DatasourceQueryKeys } from '~/api/datasources/datasource-query-keys'
import { environment } from '~/environments/environment'

const UNSEARCHABLE_DATASOURCE_API_PATH = (): string => `/me/unsearchables`

const csrf_token = getCookie('csrf_access_token')
const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    'X-CSRF-TOKEN': csrf_token
  }
}

export type Request = {
  dataSourceIds: (string | undefined)[]
}

const setUnsearchableDatasources = async (request: Request) => {
  return await api.post(UNSEARCHABLE_DATASOURCE_API_PATH(), request, config)
}

export const useUnsearchableDatasources = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: Request) => setUnsearchableDatasources(request),
    onMutate: async () => {
      await client.cancelQueries(DatasourceQueryKeys.UnsearchableDatasourcesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(DatasourceQueryKeys.UnsearchableDatasourcesQueryKey)
      client.invalidateQueries(DatasourceQueryKeys.DatasourcesQueryKey)
    }
  })
}
