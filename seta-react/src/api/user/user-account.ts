import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { SetaAccount } from '~/types/admin/user-info'

import { UserQueryKeys } from './query-keys'

const USERS_API_PATH = (): string => `/me`
const USERS_INFO_API_PATH = (): string => `/me/user-info`
const DELETE_USER_API_PATH = (): string => `/me`

const config_ = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json'
  }
}

const queryKey = {
  root: 'me/seta-info',
  account: () => [queryKey.root]
}

const getSetaUserAccount = async (config?: AxiosRequestConfig): Promise<SetaAccount> => {
  const { data } = await api.get<SetaAccount>(USERS_INFO_API_PATH(), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useSetaUserAccount = () =>
  useQuery({
    queryKey: queryKey.account(),
    queryFn: ({ signal }) => getSetaUserAccount({ signal })
  })

const getExternalProviders = async (config?: AxiosRequestConfig): Promise<SetaAccount> => {
  const { data } = await api.get<SetaAccount>(USERS_API_PATH(), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useExternalProviders = () =>
  useQuery({
    queryKey: queryKey.account(),
    queryFn: ({ signal }) => getExternalProviders({ signal })
  })

const deleteUserAccount = async () => {
  return await api.delete(DELETE_USER_API_PATH(), config_)
}

export const useDeleteUserAccount = () => {
  const client = useQueryClient()

  return useMutation({
    // eslint-disable-next-line unused-imports/no-unused-vars
    mutationFn: () => deleteUserAccount(),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.SetaAccount)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(queryKey.account())
    }
  })
}
