import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { MembershipRequestValues } from '~/pages/CommunitiesPage/components/Manage/membership-request-context'

import community_api from './api'

import { environment } from '../../environments/environment'
import type { MembershipRequest } from '../types/membership-types'

export const cacheKey = (id?: string) => ['requests', id]

export const getMembershipRequests = async (id?: string): Promise<MembershipRequest[]> => {
  const { data } = await community_api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/requests`
  )

  return data
}

export const useMembershipRequestsID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMembershipRequests(id) })

const csrf_token = getCookie('csrf_access_token')

export const updateMembershipRequest = async (
  id?: string,
  values?: MembershipRequestValues,
  userId?: string
) => {
  await community_api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}/requests/${userId}`, values, {
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

export const membershipRequests = async (): Promise<MembershipRequest[]> => {
  const { data } = await community_api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/membership-requests`
  )

  return data
}

export const useAllMembershipRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => membershipRequests() })
