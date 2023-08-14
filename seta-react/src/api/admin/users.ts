import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import { AccountStatus } from '~/types/admin/user-info'
import type { SetaUserInfo } from '~/types/admin/user-info'

const USER_INFOS_API_PATH = '/admin/users/infos'

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

  const { data } = await api.get<SetaUserInfo[]>(USER_INFOS_API_PATH, { params, ...config })

  return data
}

export const useActiveUserInfos = () => {
  return useQuery({
    queryKey: queryKey.userInfos(AccountStatus.Active),
    queryFn: ({ signal }) =>
      getUserInfos(AccountStatus.Active, { baseURL: environment.baseUrl, signal })
  })
}
