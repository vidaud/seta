import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { ResourcePermissions } from '~/pages/CommunitiesPage/contexts/resource-user-permissions'

import community_api from './api'

import type { UserPermissionsResponse } from '../types/user-permissions-types'

const PERMISSIONS_API_PATH = '/permissions'

export const cacheKey = (resourceId?: string) => ['permissions', resourceId]

export const getResourcePermissions = async (
  resourceId?: string
): Promise<UserPermissionsResponse[]> => {
  const { data } = await community_api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/resource/${resourceId}`
  )

  return data
}

export const useResourcePermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcePermissions(id) })

const csrf_token = getCookie('csrf_access_token')

export const manageResourceScopes = async (
  id?: string,
  userId?: string,
  values?: ResourcePermissions
) => {
  await community_api
    .post(`/permissions/resource/${id}/user/${userId}`, values, {
      headers: {
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
