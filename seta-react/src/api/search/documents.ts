import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import { AggregationType } from '~/types/search/aggregations'
import type { Aggregations } from '~/types/search/aggregations'
import type { Document } from '~/types/search/documents'
import { getOffset } from '~/utils/pagination-utils'

const DOCUMENTS_API_PATH = '/corpus'

export enum SearchType {
  Document = 'DOCUMENT_SEARCH',
  Chunk = 'CHUNK_SEARCH',
  AllChunks = 'ALL_CHUNKS_SEARCH'
}

export type DocumentsPayload = {
  term?: string
  n_docs?: number
  from_doc?: number
  search_type?: SearchType
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
  other?: string[]
}

export type DocumentsResponse = {
  total_docs: number
  documents: Document[]
  aggregations?: Aggregations
}

export const queryKey = {
  root: 'documents',
  docs: (term: string, page: number, perPage: number) => [queryKey.root, term, { page, perPage }]
}

const getDocuments = async (
  payload: DocumentsPayload,
  config?: AxiosRequestConfig
): Promise<DocumentsResponse> => {
  const defaultPayload: DocumentsPayload = {
    aggs: [AggregationType.DateYear],
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
}

export const useDocuments = (
  query: string,
  { page = 1, perPage = 10, ...options }: UseDocumentsOptions
) =>
  useQuery({
    queryKey: queryKey.docs(query, page, perPage),

    queryFn: ({ signal }) =>
      getDocuments(
        {
          term: query,
          from_doc: getOffset(page, perPage),
          n_docs: perPage
        },
        { signal }
      ),

    ...options
  })
