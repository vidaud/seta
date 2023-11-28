import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import type { RestrictedResources } from '../types/restricted-resource-types'

const RESOURCES_API_PATH = (): string => `/me/resources`

const queryKey = {
  root: 'me/resources',
  resources: () => [queryKey.root]
}

const getRestrictedResources = async (
  config?: AxiosRequestConfig
): Promise<RestrictedResources[]> => {
  const { data } = await api.get<RestrictedResources[]>(RESOURCES_API_PATH(), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useListRestrictedResources = () =>
  useQuery({
    queryKey: queryKey.resources(),
    queryFn: ({ signal }) => getRestrictedResources({ signal })
  })

const RESTRICTED_RESOURCES_API_PATH = (): string => `/me/resources`

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

const setRestrictedResources = async (request: FormData) => {
  return await api.post(RESTRICTED_RESOURCES_API_PATH(), request, config)
}

export const useSetRestrictedResources = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: FormData) => setRestrictedResources(request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.RestrictedResources)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.RestrictedResources)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}
