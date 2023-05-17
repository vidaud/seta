import { useQuery } from '@tanstack/react-query'

import community_api from './api'

const PERMISSIONS_API_PATH = '/permissions'

export type UserPermissionsResponse = {
  user_id: string
  scope: string
}

export const cacheKey = (id?: string) => ['permissions', id]

export const getCommunityPermissions = async (id?: string): Promise<UserPermissionsResponse[]> => {
  const { data } = await community_api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/community/${id}`
  )

  return data
}

export const useCommunityPermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityPermissions(id) })

export const getResourcePermissions = async (id?: string): Promise<UserPermissionsResponse[]> => {
  const { data } = await community_api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/resource/${id}`
  )

  return data
}

export const useResourcePermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getResourcePermissions(id) })
