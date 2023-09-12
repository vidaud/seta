import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import { environment } from '~/environments/environment'

import { CommunityQueryKeys } from './community-query-keys'

import api from '../..'
import type { UserPermissionsResponse } from '../../types/user-permissions-types'

const COMMUNITY_PERMISSIONS_API_PATH = (id?: string, userId?: string): string =>
  `/permissions/community/${id}/user/${userId}`

const csrf_token = getCookie('csrf_access_token')
const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    'X-CSRF-TOKEN': csrf_token
  }
}

const PERMISSIONS_API_PATH = '/permissions'

export const cacheKey = (id?: string) => ['permissions', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getCommunityPermissions = async (id?: string): Promise<UserPermissionsResponse[]> => {
  const { data } = await api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/community/${id}`,
    apiConfig
  )

  return data
}

export const useCommunityPermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityPermissions(id) })

const setCommunityScopes = async (id?: string, userId?: string, request?: FormData) => {
  return await api.post(COMMUNITY_PERMISSIONS_API_PATH(id, userId), request, config)
}

export const useCommunityScopes = (id?: string, userId?: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request?: FormData) => setCommunityScopes(id, userId, request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.CommunityPermissionsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.CommunityPermissionsQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}
