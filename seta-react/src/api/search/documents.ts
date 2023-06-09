import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import type { EmbeddingInfo } from '~/types/embeddings'
import { AggregationType } from '~/types/search/aggregations'
import type { Aggregations } from '~/types/search/aggregations'
import type { Document } from '~/types/search/documents'
import { getOffset } from '~/utils/pagination-utils'
import { getEmbeddingsVectors } from '~/utils/search-utils'

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
  sbert_embedding_list?: number[][]
  author?: string[]
  date_range?: string[]
  aggs?: AggregationType[]
  taxonomy_path?: string[]
  other?: { [name: string]: string }[]
}

export type DocumentsResponse = {
  total_docs: number
  documents: Document[]
  aggregations?: Aggregations
}

export type DocumentsOptions = Omit<DocumentsPayload, 'from_doc' | 'n_docs'>

export const queryKey = {
  root: 'documents',
  // We need this many params to compose the query key
  // eslint-disable-next-line max-params
  docs: (
    query: string | undefined,
    embeddings: { name: string; chunks: number }[] | undefined,
    page: number,
    perPage: number,
    searchOptions?: DocumentsOptions
  ) => [queryKey.root, { query }, { embeddings }, { page, perPage }, { searchOptions }]
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
  page?: number
  perPage?: number
  searchOptions?: DocumentsOptions
}

export const useDocuments = (
  query: string | undefined,
  embeddings: EmbeddingInfo[] | undefined,
  { page = 1, perPage = 10, searchOptions, ...options }: UseDocumentsOptions
) => {
  const vectors = getEmbeddingsVectors(embeddings)

  const embeddingsKey = embeddings?.map(({ name, chunks }) => ({
    name,
    chunks: chunks?.length ?? 0
  }))

  return useQuery({
    // The vectors in the query are identified by the `embeddingsKey` array
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey.docs(query, embeddingsKey, page, perPage, searchOptions),

    queryFn: ({ signal }) =>
      getDocuments(
        {
          term: query || undefined,
          sbert_embedding_list: vectors,
          ...searchOptions,
          from_doc: getOffset(page, perPage),
          n_docs: perPage
        },
        { signal }
      ),

    ...options
  })
}
