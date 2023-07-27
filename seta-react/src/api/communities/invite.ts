import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { InviteRequestValues } from '~/pages/CommunitiesPage/contexts/invite-request-context'

import { environment } from '~/environments/environment'

import api from '../api'
import type { CreateInvitationAPI, InviteResponse } from '../types/invite-types'

export const cacheKey = (id?: string) => ['invites', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getInvite = async (id?: string): Promise<InviteResponse[]> => {
  const { data } = await api.get<InviteResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/invites`,
    apiConfig
  )

  return data
}

export const useInviteID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getInvite(id) })

const csrf_token = getCookie('csrf_access_token')

export const createCommunityInvite = async (id?: string, values?: CreateInvitationAPI) => {
  await api
    .post<CreateInvitationAPI[]>(`${environment.COMMUNITIES_API_PATH}/${id}/invites`, values, {
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
        // console.log(response)
      }
    })
}

export const cacheNoIDKey = () => ['invites']

export const pendingInvites = async (): Promise<InviteResponse[]> => {
  const { data } = await api.get<InviteResponse[]>(`/invites/`, apiConfig)

  return data
}

export const useAllPendingInvites = () =>
  useQuery({ queryKey: cacheNoIDKey(), queryFn: () => pendingInvites() })

export const updateInviteRequest = async (id?: string, values?: InviteRequestValues) => {
  await api.put(`/invites/${id}`, values, {
    ...apiConfig,
    headers: {
      ...apiConfig?.headers,
      accept: 'application/json',
      'X-CSRF-TOKEN': csrf_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
