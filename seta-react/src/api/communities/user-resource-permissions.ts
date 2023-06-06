import { useQuery } from '@tanstack/react-query'

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
