import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import api from '~/api/api'
import type { UserPermissionsResponse } from '~/api/types/user-permissions-types'
import { environment } from '~/environments/environment'

import { ResourceQueryKeys } from './resource-query-keys'

const RESOURCE_PERMISSIONS_API_PATH = (id?: string, userId?: string): string =>
  `/permissions/resource/${id}/user/${userId}`

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

export const cacheKey = (resourceId?: string) => ['permissions', resourceId]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getResourcePermissions = async (
  resourceId?: string
): Promise<UserPermissionsResponse[]> => {
  const { data } = await api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/resource/${resourceId}`,
    apiConfig
  )

  return data
}

export const useResourcePermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcePermissions(id) })

const setResourceScopes = async (id?: string, userId?: string, request?: FormData) => {
  return await api.post(RESOURCE_PERMISSIONS_API_PATH(id, userId), request, config)
}

export const useResourceScopes = (id?: string, userId?: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request?: FormData) => setResourceScopes(id, userId, request),
    onMutate: async () => {
      await client.cancelQueries(ResourceQueryKeys.ResourcePermissionsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(ResourceQueryKeys.ResourcePermissionsQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
    }
  })
}
