import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'
import type { AuthKey } from '../types/auth-keys-types'

const AUTH_API_PATH = (name?: string): string => `/me/apps/${name}/auth-key`

const queryKey = {
  root: 'profile-auth-key',
  auth: (name?: string) => [queryKey.root, name]
}

const config_ = {
  baseURL: environment.baseUrl
}

const getApplicationAuthKey = async (
  name: string,
  config?: AxiosRequestConfig
): Promise<AuthKey> => {
  const { data } = await api.get<AuthKey>(AUTH_API_PATH(name), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useApplicationAuthKey = (name: string) =>
  useQuery({
    queryKey: queryKey.auth(name),
    queryFn: () => getApplicationAuthKey(name)
  })

export const setStoreApplicationAuthKey = async (request: AuthKey, name: string) => {
  return await api.post(AUTH_API_PATH(name), request, config_)
}

export const useStoreApplicationAuthKey = (name: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: AuthKey) => setStoreApplicationAuthKey(request, name),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.PublicKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(UserQueryKeys.PublicKeys)
    }
  })
}

export const setDeleteApplicationAuthKey = async (name: string) => {
  return await api.delete(AUTH_API_PATH(name), config_)
}

export const useDeleteAuthApplicationKey = (name: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteApplicationAuthKey(name),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.PublicKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.PublicKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}
