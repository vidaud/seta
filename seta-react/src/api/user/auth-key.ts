import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import type { AuthKeyValues } from '~/pages/UserProfile/common/contexts/auth-key-context'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'
import type { AuthKey } from '../types/auth-keys-types'

const AUTH_API_PATH = (): string => `/me/auth-key`

const queryKey = {
  root: 'profile-auth-key',
  auth: () => [queryKey.root]
}

const config_ = {
  baseURL: environment.baseUrl
}

const getPublicKey = async (config?: AxiosRequestConfig): Promise<AuthKey> => {
  const { data } = await api.get<AuthKey>(AUTH_API_PATH(), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const usePublicKey = () =>
  useQuery({
    queryKey: UserQueryKeys.PublicKeys,
    queryFn: ({ signal }) => getPublicKey({ signal })
  })

export const setStorePublicKey = async (request: AuthKeyValues) => {
  return await api.post(AUTH_API_PATH(), request, config_)
}

export const useStorePublicKey = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: AuthKeyValues) => setStorePublicKey(request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.PublicKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(UserQueryKeys.PublicKeys)
    }
  })
}

export const setDeletePublicKey = async () => {
  return await api.delete(AUTH_API_PATH(), config_)
}

export const useDeletePublicKey = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeletePublicKey(),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.PublicKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.PublicKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}
