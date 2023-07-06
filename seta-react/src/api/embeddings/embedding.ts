import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '../api'
import type { EmbeddingsResponse } from '../types/embeddings-types'

const EMBEDDINGS_API_PATH = '/compute_embeddings'

export const queryKey = {
  root: 'embeddings',
  text: (text?: string) => [queryKey.root, text]
}

export const getEmbeddings = async (
  text?: string,
  config?: AxiosRequestConfig
): Promise<EmbeddingsResponse> => {
  if (!text) {
    return { emb_with_chunk_text: [{ vector: [], chunk: 0, version: '', text: '' }] }
  }

  const { data } = await api.post<EmbeddingsResponse>(`${EMBEDDINGS_API_PATH}`, { text }, config)

  return data
}

export const useEmbeddings = (text?: string) =>
  useQuery({ queryKey: queryKey.text(text), queryFn: () => getEmbeddings(text) })
