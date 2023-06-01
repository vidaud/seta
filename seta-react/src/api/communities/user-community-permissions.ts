import { useQuery } from '@tanstack/react-query'

import community_api from './api'

import type { UserPermissionsResponse } from '../types/user-permissions-types'

const PERMISSIONS_API_PATH = '/permissions'

export const cacheKey = (id?: string) => ['my-communities', id]

export const getCommunityPermissions = async (id?: string): Promise<UserPermissionsResponse[]> => {
  const { data } = await community_api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/community/${id}`
  )

  return data
}

export const useCommunityPermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityPermissions(id) })
