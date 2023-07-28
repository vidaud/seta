import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import { environment } from '~/environments/environment'

import api from '..'
import type { UserPermissionsResponse } from '../types/user-permissions-types'

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

const csrf_token = getCookie('csrf_access_token')

export const manageResourceScopes = async (id?: string, userId?: string, values?: FormData) => {
  await api
    .post(`/permissions/resource/${id}/user/${userId}`, values, {
      ...apiConfig,
      headers: {
        ...apiConfig?.headers,
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        // window.location.reload()
      }
    })
}
