import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import community_api from './api'

import { environment } from '../../environments/environment'

export type InviteResponse = {
  community_id: string
  invite_id: string
  invited_user: string
  message: string
  status: string
  initiated_by: string
  expire_date: Date
  initiated_date: Date
}

export type CreateInvitationAPI = {
  email: string[]
  message: string
}

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
