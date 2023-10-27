import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { AccountStatus, SetaAccount } from '~/types/admin/user-info'
import type { UserRole } from '~/types/user'

import { UserQueryKeys } from './query-keys'

const USERS_API_PATH = (): string => `/me/user-info`

const queryKey = {
  root: 'me/seta-info',
  account: () => [queryKey.root]
}

const getSetaUserAccount = async (config?: AxiosRequestConfig): Promise<SetaAccount> => {
  const { data } = await api.get<SetaAccount>(USERS_API_PATH(), {
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

type PermissionsRequest = {
  scopes: string[] | null
  role?: UserRole
}

const updateAccountPermissions = async (request: PermissionsRequest) => {
  return await api.post(USERS_API_PATH(), request, { baseURL: environment.baseUrl })
}

export const useUpdateAccountPermissions = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: PermissionsRequest) => updateAccountPermissions(request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.SetaAccount)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(queryKey.account())
      //client.invalidateQueries(['/catalogue/scopes', ScopeCategory.System])
    }
  })
}

const changeAccountStatus = async (status: AccountStatus) => {
  return await api.put(USERS_API_PATH(), { status: status }, { baseURL: environment.baseUrl })
}

export const useChangeAccountStatus = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (status: AccountStatus) => changeAccountStatus(status),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.SetaAccount)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(queryKey.account())
    }
  })
}

const deleteAccount = async () => {
  return await api.delete(USERS_API_PATH(), { baseURL: environment.baseUrl })
}

export const useDeleteAccount = () => {
  const client = useQueryClient()

  return useMutation({
    // eslint-disable-next-line unused-imports/no-unused-vars
    mutationFn: (status: AccountStatus) => deleteAccount(),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.SetaAccount)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(queryKey.account())
    }
  })
}
