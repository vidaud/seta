import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { getCookie } from 'typescript-cookie'

import type { MembershipValues } from '~/pages/CommunitiesPage/contexts/membership-context'

import api from '~/api/api'
import type { CreateMembershipRequestAPI, MembershipResponse } from '~/api/types/membership-types'
import { environment } from '~/environments/environment'

import { CommunityQueryKeys } from '../communities/community-query-keys'
import { ResourceQueryKeys } from '../resources/resource-query-keys'

const MEMBERSHIP_API_PATH = (id: string): string => `/communities/${id}/requests`
const OPEN_MEMBERSHIP_API_PATH = (id: string): string => `/communities/${id}/memberships`
const REMOVE_MEMBERSHIP_API_PATH = (id: string): string => `/communities/${id}/membership`

const csrf_token = getCookie('csrf_access_token')

const config = {
  baseURL: environment.baseUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' }
}

export const cacheKey = (id?: string) => ['memberships', id]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getMembership = async (id: string): Promise<MembershipResponse[]> => {
  const { data } = await api.get<MembershipResponse[]>(OPEN_MEMBERSHIP_API_PATH(id), apiConfig)

  return data
}

export const useMembershipID = (id: string) =>
  useQuery({ queryKey: cacheKey(id), queryFn: () => getMembership(id) })

const setNewCommunityMembership = async (id: string, request: CreateMembershipRequestAPI) => {
  return await api.post(MEMBERSHIP_API_PATH(id), request, config)
}

export const useNewCommunityMembership = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateMembershipRequestAPI) => setNewCommunityMembership(id, request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.MembershipRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.MembershipRequestsQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

const setOpenCommunityMembership = async (id: string, request?: null) => {
  return await api.post(OPEN_MEMBERSHIP_API_PATH(id), request, config)
}

export const useOpenCommunityMembership = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request?: null) => setOpenCommunityMembership(id, request),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.OpenMembershipRequestsQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.OpenMembershipRequestsQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

const setRemoveCommunityMembership = async (id: string) => {
  return await api.delete(REMOVE_MEMBERSHIP_API_PATH(id), config)
}

export const useRemoveCommunityMembership = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => setRemoveCommunityMembership(id),
    onMutate: async () => {
      await client.cancelQueries(CommunityQueryKeys.RemoveMembershipQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(CommunityQueryKeys.RemoveMembershipQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
      client.invalidateQueries(CommunityQueryKeys.CommunitiesQueryKey)
    }
  })
}

export const updateCommunityMembership = async (
  id?: string,
  values?: MembershipValues,
  userId?: string
) => {
  await api
    .put(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, values, {
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
        window.location.reload()
      }
    })
}

export const deleteMembershipByID = async (id?: string, userId?: string) => {
  await api
    .delete(`${environment.COMMUNITIES_API_PATH}/${id}/memberships/${userId}`, {
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
        window.location.href = `/community/communities//${id}/members`
      }
    })
}
