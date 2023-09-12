import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCookie } from 'typescript-cookie'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { ResourceQueryKeys } from './resource-query-keys'

const RESTRICTED_RESOURCE_API_PATH = (): string => `/me/resources`

const csrf_token = getCookie('csrf_access_token')
const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
    'X-CSRF-TOKEN': csrf_token
  }
}

const setRestrictedResources = async (request: FormData) => {
  return await api.post(RESTRICTED_RESOURCE_API_PATH(), request, config)
}

export const useRestrictedResource = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: FormData) => setRestrictedResources(request),
    onMutate: async () => {
      await client.cancelQueries(ResourceQueryKeys.RestrictedResourcesQueryKey)
    },
    onSuccess: () => {
      client.invalidateQueries(ResourceQueryKeys.RestrictedResourcesQueryKey)
      client.invalidateQueries(ResourceQueryKeys.ResourcesQueryKey)
    }
  })
}
