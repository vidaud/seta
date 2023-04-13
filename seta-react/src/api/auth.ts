import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import type { User } from '~/types/user'

const BASE_URL = environment.baseUrl
const USER_INFO_API_PATH = '/me/user-info'
const REFRESH_TOKEN_API_PATH = '/refresh'

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export type UserInfoResponse = User

const getUserInfo = async (): Promise<UserInfoResponse> => {
  const { data } = await api.get<UserInfoResponse>(USER_INFO_API_PATH, apiConfig)

  return data
}

type UseUserInfoOptions = Pick<
  UseQueryOptions<UserInfoResponse>,
  'enabled' | 'onSuccess' | 'onError' | 'onSettled' | 'notifyOnChangeProps'
>

export const useUserInfo = (options: UseUserInfoOptions) =>
  useQuery({
    ...options,
    queryKey: ['user-info'],
    queryFn: getUserInfo,
    cacheTime: 0
  })

export const refreshToken = async () => api.get(REFRESH_TOKEN_API_PATH, apiConfig)

export const logout = async () =>
  api.post('/logout', { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }, apiConfig)
