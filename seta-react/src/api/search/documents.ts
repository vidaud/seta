import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { AggregationType } from '~/types/search/aggregations'
import type { Aggregations } from '~/types/search/aggregations'
import type { Document } from '~/types/search/documents'
import { getOffset } from '~/utils/pagination-utils'
import type { OtherType } from '~/pages/SearchWithFilters/types/other-filter'

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
  root: 'documents',
  docs: (term: string, page: number, perPage: number, searchOptions?: DocumentsOptions) => [
    queryKey.root,
    term,
    { page, perPage },
    { searchOptions }
  ]
}

const getDocuments = async (
  payload: DocumentsPayload,
  config?: AxiosRequestConfig
): Promise<DocumentsResponse> => {
  const defaultPayload: DocumentsPayload = {
    aggs: [
      AggregationType.DateYear,
      AggregationType.CollectionReference,
      AggregationType.Taxonomies
    ],
    n_docs: 100
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
  page: number
  perPage: number
  searchOptions?: DocumentsOptions
}

export const useDocuments = (
  query: string,
  { page = 1, perPage = 10, searchOptions, ...options }: UseDocumentsOptions
) =>
  useQuery({
    queryKey: queryKey.docs(query, page, perPage, searchOptions),

    queryFn: ({ signal }) =>
      getDocuments(
        {
          ...searchOptions,
          term: query,
          from_doc: getOffset(page, perPage),
          n_docs: perPage
        },
        { signal }
      ),

    ...options
  })
