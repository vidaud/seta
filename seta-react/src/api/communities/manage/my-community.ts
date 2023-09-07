import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'

import api from '~/api/api'
import type { CommunityResponse, CreateCommunityAPI } from '~/api/types/community-types'
import type { ResourceResponse } from '~/api/types/resource-types'
import { environment } from '~/environments/environment'

import { CommunityQueryKeys } from './community-query-keys'

const CREATE_COMMUNITY_API_PATH = (): string => `/communities`
const UPDATE_COMMUNITY_API_PATH = (id: string): string => `/communities/${id}`
const DELETE_COMMUNITY_API_PATH = (id: string): string => `/communities/${id}`

const csrf_token = getCookie('csrf_access_token')
const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    'X-CSRF-TOKEN': csrf_token
  }
}

export const cacheKey = (id?: string) => ['communities', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getCommunity = async (id?: string): Promise<CommunityResponse> => {
  const { data } = await api.get<CommunityResponse>(
    `${environment.COMMUNITIES_API_PATH}/${id}`,
    apiConfig
  )

  return data
}

export const useCommunityID = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getCommunity(id) })

const getMyCommunityResources = async (id?: string): Promise<ResourceResponse[]> => {
  const { data } = await api.get<ResourceResponse[]>(
    `${environment.COMMUNITIES_API_PATH}/${id}/resources`,
    apiConfig
  )

  return data
}

export const useMyCommunityResources = (id?: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMyCommunityResources(id) })

export const createCommunity = async (values?: CreateCommunityAPI) => {
  await api.post<CreateCommunityAPI[]>(`${environment.COMMUNITIES_API_PATH}`, values, {
    ...apiConfig,
    headers: {
      ...apiConfig?.headers,
      accept: 'application/json',
      'X-CSRF-TOKEN': csrf_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const setCreateCommunity = async (request: CommunityValues) => {
  return await api.post(CREATE_COMMUNITY_API_PATH(), request, config)
}

export const useCreateCommunity = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: CommunityValues) => setCreateCommunity(request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.CommunitiesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

export const setUpdateCommunity = async (request: CommunityValues, id: string) => {
  return await api.put(UPDATE_COMMUNITY_API_PATH(id), request, config)
}

export const useSetUpdateCommunity = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: CommunityValues) => setUpdateCommunity(request, id),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.CommunitiesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

export const setDeleteCommunity = async (id: string) => {
  return await api.delete(DELETE_COMMUNITY_API_PATH(id), config)
}

export const useDeleteCommunity = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteCommunity(id),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.CommunitiesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}
