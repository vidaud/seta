import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import api from '../api'
import type { ChangeRequestResponse, CommunityChangeRequests } from '../types/change-request-types'

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

export const getPendingChangeRequests = async (): Promise<CommunityChangeRequests[]> => {
  const { data } = await api.get<CommunityChangeRequests[]>(
    `/communities/change-requests/pending`,
    apiConfig
  )

  return data
}

export const usePendingChangeRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getPendingChangeRequests() })
