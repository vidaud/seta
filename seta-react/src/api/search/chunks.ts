import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import type { Chunk } from '~/types/search/documents'
import { getOffset } from '~/utils/pagination-utils'

const DOCUMENT_CHUNKS_API_PATH = '/corpus/document'

type GetChunksOptions = {
  page?: number
  perPage?: number
}

export type ChunksResponse = {
  chunk_list: Chunk[]
  num_chunks: number
}

export const queryKey = {
  root: 'chunks',
  chunks: (documentId: string, page: number, perPage: number) => [
    queryKey.root,
    { documentId },
    { page, perPage }
  ]
}

const getChunks = async (
  documentId: string,
  options: GetChunksOptions,
  config?: AxiosRequestConfig
): Promise<ChunksResponse> => {
  const { page = 1, perPage = 10 } = options

  const params = {
    n_docs: perPage,
    from_doc: getOffset(page, perPage)
  }

  const { data } = await api.get<ChunksResponse>(`${DOCUMENT_CHUNKS_API_PATH}/${documentId}`, {
    params,
    ...config
  })

  return data
}

type UseChunksOptions = UseQueryOptions<ChunksResponse> & GetChunksOptions

export const useChunks = (documentId: string, options?: UseChunksOptions) => {
  const { page = 1, perPage = 10, ...queryOptions } = options ?? {}

  return useQuery({
    queryKey: queryKey.chunks(documentId, page, perPage),

    queryFn: ({ signal }) => getChunks(documentId, { page, perPage }, { signal }),
    ...queryOptions
  })
}
