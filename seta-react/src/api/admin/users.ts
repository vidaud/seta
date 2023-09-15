import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import { AccountStatus } from '~/types/admin/user-info'
import type { SetaAccount, SetaUserInfo } from '~/types/admin/user-info'

import { AdminQueryKeys } from './query-keys'

const USER_INFOS_API_PATH = '/admin/users/infos'

const USERS_API_PATH = '/admin/users'

const queryKey = {
  root: 'user-infos',
  userInfos: (status: string | undefined) => [queryKey.root, { status }]
}

const getUserInfos = async (
  status?: AccountStatus,
  config?: AxiosRequestConfig
): Promise<SetaUserInfo[]> => {
  const params = status
    ? {
        status: status
      }
    : undefined

  const { data } = await api.get<SetaUserInfo[]>(USER_INFOS_API_PATH, {
    params,
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useActiveUserInfos = () => {
  return useQuery({
    queryKey: queryKey.userInfos(AccountStatus.Active),
    queryFn: ({ signal }) => getUserInfos(AccountStatus.Active, { signal })
  })
}

const getAllAccounts = async (config?: AxiosRequestConfig): Promise<SetaAccount[]> => {
  const { data } = await api.get<SetaAccount[]>(USERS_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useAllAccounts = () => {
  return useQuery({
    queryKey: AdminQueryKeys.AllUsers,
    queryFn: ({ signal }) => getAllAccounts({ signal })
  })
}
