import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'
import type { RSAKey } from '../types/rsa-keys-types'

const RSA_API_PATH = (name?: string): string => `/me/apps/${name}/rsa-key`

const queryKey = {
  root: 'profile-rsa-keys',
  rsa: (name?: string) => [queryKey.root, name]
}

const config_ = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json'
  }
}

const getApplicationRSAKey = async (name: string, config?: AxiosRequestConfig): Promise<RSAKey> => {
  const { data } = await api.get<RSAKey>(RSA_API_PATH(name), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useApplicationRSAKey = (name: string) =>
  useQuery({
    queryKey: queryKey.rsa(name),
    queryFn: () => getApplicationRSAKey(name)
  })

export const setGenerateApplicationPublicKey = async (name: string) => {
  return await api.post(RSA_API_PATH(name), null, config_)
}

export const useGenerateApplicationPublicKey = (name: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setGenerateApplicationPublicKey(name),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.RSAKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.RSAKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}

export const setDeleteApplicationRSAKey = async (name: string) => {
  return await api.delete(RSA_API_PATH(name), config_)
}

export const useDeleteRSAApplicationKey = (name: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteApplicationRSAKey(name),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.RSAKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.RSAKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}
