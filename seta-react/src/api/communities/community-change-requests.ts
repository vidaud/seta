import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { ChangeRequestValues } from '~/pages/CommunitiesPage/contexts/change-request-context'

import community_api from './api'

import { environment } from '../../environments/environment'
import type { ChangeRequestResponse } from '../types/change-request-types'

export const cacheKey = (id?: string) => ['change-requests', id]

export const getCommunityChangeRequests = async (id?: string): Promise<ChangeRequestResponse> => {
  const { data } = await community_api.get<ChangeRequestResponse>(
    `/communities/${id}/change-requests`
  )

  return data
}

export const useCommunityChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityChangeRequests(id) })

const csrf_token = getCookie('csrf_access_token')

export const createCommunityChangeRequest = async (id?: string, values?: ChangeRequestValues) => {
  await community_api
    .post(`${environment.COMMUNITIES_API_PATH}/${id}/change-requests`, values, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 200) {
        window.location.reload()
      }
    })
}
