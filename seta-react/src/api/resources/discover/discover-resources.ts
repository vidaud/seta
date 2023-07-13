import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import type { ResourceResponse } from '~/api/types/resource-types'

import community_api from '../../communities/api'

export const cacheKey = () => ['resources']

const getAllResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await community_api.get<ResourceResponse[]>(`/discover/resources`)

  return data
}

export const useAllResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllResources() })

const csrf_token = getCookie('csrf_access_token')

export const manageRestrictedResources = async (resources?: FormData) => {
  await community_api
    .post<FormData>(`/me/resources`, resources, {
      headers: {
        accept: 'application/json',
        'X-CSRF-TOKEN': csrf_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.status === 201) {
        // window.location.href = `/resources`
      }
    })
}
