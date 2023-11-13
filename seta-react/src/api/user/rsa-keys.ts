import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'

const RSA_API_PATH = (): string => `/me/rsa-key`

const queryKey = {
  root: 'profile-rsa-keys',
  rsa: () => [queryKey.root]
}

const config_ = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json'
  }
}

type RSAKey = {
  privateKey?: string
  publicKey: string
}

const getRSAKey = async (config?: AxiosRequestConfig): Promise<RSAKey> => {
  const { data } = await api.get<RSAKey>(RSA_API_PATH(), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useRSAKey = () =>
  useQuery({
    queryKey: queryKey.rsa(),
    queryFn: ({ signal }) => getRSAKey({ signal })
  })

export const setGeneratePublicKey = async () => {
  return await api.post(RSA_API_PATH(), null, config_)
}

export const useGeneratePublicKey = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setGeneratePublicKey(),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.RSAKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.RSAKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}

export const setDeleteRSAKey = async () => {
  return await api.delete(RSA_API_PATH(), config_)
}

export const useDeleteRSAKey = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteRSAKey(),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.RSAKeys)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.RSAKeys)
      client.invalidateQueries(UserQueryKeys.SetaAccount)
    }
  })
}
