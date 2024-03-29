import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'
import type {
  ApplicationPermissions,
  PermissionsRequest
} from '../types/applications-permissions-types'

const APPLICATION_PERMISSIONS_API_PATH = (name): string => `/me/apps/${name}/permissions`

const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json'
  }
}

const queryKey = {
  root: 'profile-applications',
  apps: (name?: string) => [queryKey.root, name]
}

const getApplicationPermissions = async (name?: string): Promise<ApplicationPermissions[]> => {
  const { data } = await api.get<ApplicationPermissions[]>(APPLICATION_PERMISSIONS_API_PATH(name), {
    ...config
  })

  return data
}

export const useApplicationsPermissions = (name?: string) =>
  useQuery({
    queryKey: queryKey.apps(name),
    queryFn: () => getApplicationPermissions(name)
  })

const updateApplicationPermissions = async (appName: string, request: PermissionsRequest[]) => {
  return await api.post(APPLICATION_PERMISSIONS_API_PATH(appName), request, {
    baseURL: environment.baseUrl
  })
}

export const useUpdateApplicationsPermissions = (appName: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: PermissionsRequest[]) => updateApplicationPermissions(appName, request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.Applications)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(UserQueryKeys.Applications)
    }
  })
}
