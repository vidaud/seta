import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api/api'
import { environment } from '~/environments/environment'

import { AdminQueryKeys } from './query-keys'

import type { AnnotationCategoryResponse } from '../types/annotation-categories-types'

export const cacheKey = () => ['annotations']
const BASE_URL = environment.baseUrl
const ANNOTATION_CATEGORIES = (): string => '/admin/annotations/categories'

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const getAnnotationCategories = async (): Promise<AnnotationCategoryResponse[]> => {
  const { data } = await api.get<AnnotationCategoryResponse[]>(ANNOTATION_CATEGORIES(), apiConfig)

  return data
}

export const useAnnotationCategories = () =>
  useQuery({
    queryKey: AdminQueryKeys.AnnotationCategories,
    queryFn: () => getAnnotationCategories()
  })
