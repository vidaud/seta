import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { InviteRequestValues } from '~/pages/CommunitiesPage/contexts/invite-request-context'

import community_api from './api'

import { environment } from '../../environments/environment'
import type { CreateInvitationAPI, InviteResponse } from '../types/invite-types'

export const cacheKey = (id?: string) => ['invites', id]

export const getInvite = async (id?: string): Promise<InviteResponse[]> => {
  const { data } = await community_api.get<InviteResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/invites`
  )

  return data
}

export const useInviteID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getInvite(id) })

const csrf_token = getCookie('csrf_access_token')

export const createCommunityInvite = async (id?: string, values?: CreateInvitationAPI) => {
  await community_api
    .post<CreateInvitationAPI[]>(`${environment.COMMUNITIES_API_PATH}/${id}/invites`, values, {
      headers: {
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
  const { data } = await community_api.get<InviteResponse[]>(`/invites/`)

  return data
}

export const useAllPendingInvites = () =>
  useQuery({ queryKey: cacheNoIDKey(), queryFn: () => pendingInvites() })

export const updateInviteRequest = async (id?: string, values?: InviteRequestValues) => {
  await community_api
    .put(`/invites/${id}`, values, {
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
