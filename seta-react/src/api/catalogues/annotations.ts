import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions, QueryKey } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import type { AnnotationResponse } from '~/api/types/annotations-types'
import { environment } from '~/environments/environment'
import type { Label } from '~/types/filters/label'

const cataloguesConfig: AxiosRequestConfig = {
  baseURL: environment.baseUrl
}

const ANNOTATIONS_API_PATH = '/catalogue/annotations'

export type AnnotationsResponse = AnnotationResponse[]

export const annotationsQueryKey: QueryKey = ['annotations']

/**
 * Transform the annotation response to a label
 * @param annotation The annotation response
 * @returns The label
 */
const toLabel = ({ label, color, category }: AnnotationResponse): Label => ({
  id: `${category}-${label}`,
  name: label,
  color,
  category
})

const getAnnotations = async (config?: AxiosRequestConfig): Promise<Label[]> => {
  const { data } = await api.get<AnnotationsResponse>(ANNOTATIONS_API_PATH, {
    ...cataloguesConfig,
    ...config
  })

  const labels = data.map(toLabel)

  return labels
}

type UseAnnotationsOptions = UseQueryOptions<Label[]>

export const useAnnotations = (options?: UseAnnotationsOptions) =>
  useQuery({
    queryKey: annotationsQueryKey,
    queryFn: getAnnotations,
    ...options
  })
