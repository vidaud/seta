import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { AnnotationResponse, ImportResponse } from '../types/annotations-types'

export const cacheKey = () => ['annotations']
const BASE_URL = environment.baseUrl
const ANNOTATIONS = (): string => '/admin/annotations'
const IMPORT_ANNOTATIONS = (): string => '/admin/annotations/import'
const ANNOTATIONS_API_PATH = (category: string, label: string): string =>
  `/admin/annotations/${category}/${label}`

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
    ANNOTATIONS_API_PATH(request.category, request.label),
    {
      color: request.color
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

export const setDeleteAnnotation = async (category: string, label: string) => {
  return await api.delete(ANNOTATIONS_API_PATH(category, label), apiConfig)
}

export const useDeleteAnnotation = (category: string, label: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => setDeleteAnnotation(category, label),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.Annotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}

export const importAnnotations = async (request: ImportResponse) => {
  return await api.post(IMPORT_ANNOTATIONS(), request, apiConfig)
}

export const useImportAnnotations = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (request: ImportResponse) => importAnnotations(request),
    onMutate: async () => {
      await client.cancelQueries(AdminQueryKeys.ImportAnnotations)
    },
    onSuccess: () => {
      client.invalidateQueries(AdminQueryKeys.ImportAnnotations)
      client.invalidateQueries(AdminQueryKeys.Annotations)
    }
  })
}
