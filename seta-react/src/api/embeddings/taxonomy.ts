import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { AggregationType } from '../../types/search/aggregations'
import api from '../api'
import type { DocumentsPayload, DocumentsResponse } from '../types/taxonomy-types'

const DOCUMENTS_API_PATH = '/corpus'

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
