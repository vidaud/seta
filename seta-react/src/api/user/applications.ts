import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApplicationValues } from '~/pages/UserProfile/contexts/application-context'

import { environment } from '~/environments/environment'

import { UserQueryKeys } from './query-keys'

import api from '../api'

const CREATE_APPLICATION_API_PATH = (): string => `/me/apps`
const UPDATE_APPLICATION_API_PATH = (name): string => `/me/apps/${name}`
const APPLICATION_API_PATH = (): string => `/me/apps`

const config = {
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json'
  }
}

const queryKey = {
  root: 'me/apps',
  apps: () => [queryKey.root]
}

type ApplicationModel = {
  user_id: string
  name: string
  description: string
  status: string
}

const getApplications = async (): Promise<ApplicationModel[]> => {
  const { data } = await api.get<ApplicationModel[]>(APPLICATION_API_PATH(), {
    ...config
  })

  return data
}

export const useApplicationsList = () =>
  useQuery({
    queryKey: queryKey.apps(),
    queryFn: () => getApplications()
  })

export const setCreateApplication = async (request: ApplicationValues) => {
  return await api.post(CREATE_APPLICATION_API_PATH(), request, config)
}

export const useCreateApplication = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: ApplicationValues) => setCreateApplication(request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.Applications)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(UserQueryKeys.Applications)
    }
  })
}

const updateApplications = async (request: ApplicationValues) => {
  return await api.put(
    UPDATE_APPLICATION_API_PATH(request.name),
    {
      new_name: request.new_name,
      status: request.status,
      description: request.description,
      name: request.name
    },
    config
  )
}

export const useUpdateApplication = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: ApplicationValues) => updateApplications(request),
    onMutate: async () => {
      await client.cancelQueries(UserQueryKeys.Applications)
    },
    onSuccess: () => {
      client.invalidateQueries(UserQueryKeys.SetaAccount)
      client.invalidateQueries(UserQueryKeys.Applications)
    }
  })
}
