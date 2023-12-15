import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { AnnotationResponse } from '../types/annotations-types'

export const cacheKey = () => ['annotations']
const BASE_URL = environment.baseUrl
const ANNOTATIONS = (): string => '/admin/annotations'
const ANNOTATIONS_API_PATH = (label): string => `/admin/annotations/${label}`

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getAnnotations = async (): Promise<AnnotationResponse[]> => {
  const { data } = await api.get<AnnotationResponse[]>(ANNOTATIONS(), apiConfig)

  return data
}

export const useAnnotations = () =>
  useQuery({ queryKey: AdminQueryKeys.Annotations, queryFn: () => getAnnotations() })

export const setCreateAnnotation = async (request: AnnotationResponse) => {
  return await api.post(ANNOTATIONS(), request, apiConfig)
}

export const useCreateAnnotation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: AnnotationResponse) => setCreateAnnotation(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Annotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}

const updateAnnotation = async (request: AnnotationResponse) => {
  return await api.put(
    ANNOTATIONS_API_PATH(request.label),
    {
      color: request.color,
      category: request.category
    },
    apiConfig
  )
}

export const useUpdateAnnotation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: AnnotationResponse) => updateAnnotation(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Annotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}

export const setDeleteAnnotation = async (label: string) => {
  return await api.delete(ANNOTATIONS_API_PATH(label), apiConfig)
}

export const useDeleteAnnotation = (label: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteAnnotation(label),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Annotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}
