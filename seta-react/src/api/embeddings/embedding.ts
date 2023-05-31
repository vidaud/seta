import { useQuery } from '@tanstack/react-query'

import api from '../api'

const EMBEDDINGS_API_PATH = '/compute_embeddings'

export type EmbeddingsValue = {
  vector: number[]
  chunk: number
  version: string
  text: string
}

export type EmbeddingsResponse = {
  emb_with_chunk_text: EmbeddingsValue[]
}

export const queryKey = {
  root: 'embeddings',
  text: (text?: string) => [queryKey.root, text]
}

const getEmbeddings = async (text?: string): Promise<EmbeddingsResponse> => {
  if (!text) {
    return { emb_with_chunk_text: [{ vector: [], chunk: 0, version: '', text: '' }] }
  }

  const { data } = await api.post<EmbeddingsResponse>(`${EMBEDDINGS_API_PATH}?text=${text}`)

  console.log(data)

  // Remove duplicates
  return {
    emb_with_chunk_text: data.emb_with_chunk_text
  }
}

export const useEmbedding = (text?: string) =>
  useQuery({ queryKey: queryKey.text(text), queryFn: () => getEmbeddings(text) })
