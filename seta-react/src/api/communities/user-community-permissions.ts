import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

import type { UserPermissionsResponse } from '../types/user-permissions-types'

const PERMISSIONS_API_PATH = '/permissions'

export const cacheKey = (id?: string) => ['permissions', id]

export const getCommunityPermissions = async (id?: string): Promise<UserPermissionsResponse[]> => {
  const { data } = await community_api.get<UserPermissionsResponse[]>(
    `${PERMISSIONS_API_PATH}/community/${id}`
  )

  return data
}

export const useCommunityPermissionsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityPermissions(id) })

const csrf_token = getCookie('csrf_access_token')

export const manageCommunityScopes = async (id?: string, userId?: string, values?: FormData) => {
  await community_api
    .post(`/permissions/community/${id}/user/${userId}`, values, {
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
