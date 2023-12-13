import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { AnnotationResponse } from '../types/annotations-types'

export const cacheKey = () => ['annotations']
const BASE_URL = environment.baseUrl
const ANNOTATIONS = (): string => '/admin/annotations'
const ANNOTATIONS_API_PATH = (id): string => `/admin/annotations/${id}`

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
    ANNOTATIONS_API_PATH(request.id),
    {
      label: request.label,
      color_code: request.color_code,
      category_id: request.category_id
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

export const setDeleteAnnotation = async (id: string) => {
  return await api.delete(ANNOTATIONS_API_PATH(id), apiConfig)
}

export const useDeleteAnnotation = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteAnnotation(id),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Annotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}
