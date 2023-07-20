import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { MembershipRequestValues } from '~/pages/CommunitiesPage/pages/contexts/membership-request-context'

import { environment } from '../../environments/environment'
import api from '../api'
import type { MembershipRequest } from '../types/membership-types'

export const cacheKey = (id?: string) => ['requests', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getMembershipRequests = async (id?: string): Promise<MembershipRequest[]> => {
  const { data } = await api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/requests`,
    apiConfig
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
  await api.put(`${environment.COMMUNITIES_API_PATH}/${id}/requests/${userId}`, values, {
    ...apiConfig,
    headers: {
      ...apiConfig?.headers,
      accept: 'application/json',
      'X-CSRF-TOKEN': csrf_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const membershipRequests = async (): Promise<MembershipRequest[]> => {
  const { data } = await api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/membership-requests`,
    apiConfig
  )

  return data
}

export const useAllMembershipRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => membershipRequests() })
