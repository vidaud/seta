import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'
import type { User } from '~/types/user'

import api from '../api'

const BASE_URL = environment.baseUrl
const USER_INFO_API_PATH = '/me/permissions'

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

type SystemScopes = {
  area: string
  scope: string
}

type CommunityScopes = {
  community_id: string
  scopes: string[]
}

type ResourceScopes = {
  resource_id: string
  scopes: string[]
}

type UserPermissions = {
  system_scopes: SystemScopes[]
  community_scopes: CommunityScopes[]
  resource_scopes: ResourceScopes[]
}

export type UserInfoResponse = User

const getUserPermissions = async (): Promise<UserPermissions> => {
  const { data } = await api.get<UserPermissions>(USER_INFO_API_PATH, apiConfig)

  return data
}

export const useUserPermissions = () =>
  useQuery({
    queryKey: ['permissions'],
    queryFn: getUserPermissions,
    cacheTime: 0
  })
