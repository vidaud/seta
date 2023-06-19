import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

import { environment } from '../../environments/environment'
import type { CommunityChangeRequests, ChangeRequestResponse } from '../types/change-request-types'

export const cacheKey = (id?: string) => ['change-requests', id]

export const getCommunityChangeRequests = async (id?: string): Promise<ChangeRequestResponse> => {
  const { data } = await community_api.get<ChangeRequestResponse>(
    `/communities/${id}/change-requests`
  )

  console.log(data)

  return data
}

export const useCommunityChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityChangeRequests(id) })

const csrf_token = getCookie('csrf_access_token')

export const createChangeRequest = async (id?: string, values?: CommunityChangeRequests) => {
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
        // window.location.reload()
      }
    })
}
