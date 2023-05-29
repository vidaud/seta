import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import type { Document } from '~/types/search/documents'

import type { OtherType } from '../../pages/SearchWithFilters/types/other-filter'
import type { Aggregations } from '../../types/search/aggregations'
import { AggregationType } from '../../types/search/aggregations'
import api from '../api'

const DOCUMENTS_API_PATH = '/corpus'

export type DocumentsPayload = {
  term?: string
  n_docs?: number
  from_doc?: number
  search_type?: string
  source?: string[]
  collection?: string[]
  subject?: string[]
  reference?: string[]
  in_force?: string
  sort?: string[]
  semantic_sort_id?: string
  semantic_sort_id_list?: string[]
  author?: string[]
  date_range?: string[]
  aggs?: AggregationType[]
  taxonomy_path?: string[]
  other?: OtherType[]
}

export type DocumentsResponse = {
  total_docs: number
  documents: Document[]
  aggregations?: Aggregations
}

export type DocumentsOptions = Omit<DocumentsPayload, 'from_doc' | 'n_docs'>

export const queryKey = {
  root: 'taxonomies',
  docs: (searchOptions?: DocumentsOptions) => [queryKey.root, { searchOptions }]
}

const getDocuments = async (
  payload: DocumentsPayload,
  config?: AxiosRequestConfig
): Promise<DocumentsResponse> => {
  const defaultPayload: DocumentsPayload = {
    aggs: [AggregationType.Taxonomies]
  }
  const { data } = await api.post<DocumentsResponse, DocumentsPayload>(
    DOCUMENTS_API_PATH,
    {
      ...defaultPayload,
      ...payload
    },
    config
  )

  return data
}

type UseDocumentsOptions = UseQueryOptions<DocumentsResponse> & {
  searchOptions?: DocumentsOptions
}

export const useDocuments = ({ searchOptions, ...options }: UseDocumentsOptions) =>
  useQuery({
    queryKey: queryKey.docs(searchOptions),

    queryFn: ({ signal }) =>
      getDocuments(
        {
          ...searchOptions
        },
        { signal }
      ),

    ...options
  })
