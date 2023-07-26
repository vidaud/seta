import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { ResourceResponse } from '~/api/types/resource-types'

import { environment } from '../../../environments/environment'
import api from '../../api'

export const cacheKey = () => ['resources']
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getAllResources = async (): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(`/discover/resources`, apiConfig)

  return data
}

export const useAllResources = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllResources() })

const csrf_token = getCookie('csrf_access_token')

export const manageRestrictedResources = async (resources?: FormData) => {
  await api
    .post<FormData>(`/me/resources`, resources, {
      ...apiConfig,
      headers: {
        ...apiConfig?.headers,
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
