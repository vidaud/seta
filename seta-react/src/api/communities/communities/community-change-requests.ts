import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import type { ChangeRequestResponse } from '~/api/types/change-request-types'
import { environment } from '~/environments/environment'

export const cacheKey = (id?: string) => ['change-requests', id]

const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getCommunityChangeRequests = async (id?: string): Promise<ChangeRequestResponse> => {
  const { data } = await api.get<ChangeRequestResponse>(
    `/communities/${id}/change-requests`,
    apiConfig
  )

  return data
}

export const useCommunityChangeRequests = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunityChangeRequests(id) })
