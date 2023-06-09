import { getCookie } from 'typescript-cookie'

import community_api from './api'

import { environment } from '../../environments/environment'

export const cacheKey = (id?: string) => ['memberships', id]

const csrf_token = getCookie('csrf_access_token')

export const leaveCommunity = async (id?: string) => {
  await community_api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}/membership`, {
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
