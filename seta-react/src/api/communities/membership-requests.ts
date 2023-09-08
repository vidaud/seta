import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '../../environments/environment'
import api from '../api'
import type { MembershipRequest } from '../types/membership-types'

export const cacheKey = (id?: string) => ['requests', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getAllMembershipRequests = async (): Promise<MembershipRequest[]> => {
  const { data } = await api.get<MembershipRequest[]>(
    `${environment.COMMUNITIES_API_PATH}/requests`,
    apiConfig
  )

  return data
}

export const useMembershipRequests = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getAllMembershipRequests() })
