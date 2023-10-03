import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { AccountStatus, SetaAccount } from '~/types/admin/user-info'
import type { UserRole } from '~/types/user'

import { AdminQueryKeys } from './query-keys'

const USERS_API_PATH = (id: string): string => `/admin/users/${id}`

const queryKey = {
  root: 'seta-user',
  account: (id: string | undefined) => [queryKey.root, { id }]
}

const getSetaAccount = async (id: string, config?: AxiosRequestConfig): Promise<SetaAccount> => {
  const { data } = await api.get<SetaAccount>(USERS_API_PATH(id), {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useSetaAccount = (id: string) =>
  useQuery({
    queryKey: queryKey.account(id),
    queryFn: ({ signal }) => getSetaAccount(id, { signal })
  })

type PermissionsRequest = {
  scopes: string[] | null
  role?: UserRole
}

const updateAccountPermissions = async (userId: string, request: PermissionsRequest) => {
  return await api.post(USERS_API_PATH(userId), request, { baseURL: environment.baseUrl })
}

export const useUpdateAccountPermissions = (userId: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: PermissionsRequest) => updateAccountPermissions(userId, request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.SetaUsers)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.SetaUsers)
      client.invalidateQueries(queryKey.account(userId))
      //client.invalidateQueries(['/catalogue/scopes', ScopeCategory.System])
    }
  })
}

const changeAccountStatus = async (userId: string, status: AccountStatus) => {
  return await api.put(USERS_API_PATH(userId), { status: status }, { baseURL: environment.baseUrl })
}

export const useChangeAccountStatus = (userId: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (status: AccountStatus) => changeAccountStatus(userId, status),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.SetaUsers)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.SetaUsers)
      client.invalidateQueries(queryKey.account(userId))
    }
  })
}

const deleteAccount = async (userId: string) => {
  return await api.delete(USERS_API_PATH(userId), { baseURL: environment.baseUrl })
}

export const useDeleteAccount = (userId: string) => {
  const client = useQueryClient()

  return useMutation({
    // eslint-disable-next-line unused-imports/no-unused-vars
    mutationFn: (status: AccountStatus) => deleteAccount(userId),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.SetaUsers)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.SetaUsers)
      client.invalidateQueries(queryKey.account(userId))
    }
  })
}
