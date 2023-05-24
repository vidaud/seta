import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import type { SimilarTerm } from '~/types/search/similar-term'

const RELATED_TERMS_API_PATH = '/similar'

export type RelatedTermsResponse = {
  words: SimilarTerm[]
}

export const queryKey = {
  root: 'related-terms',
  words: (words?: string) => [queryKey.root, words]
}

const getRelatedTerms = async (
  words?: string,
  config?: AxiosRequestConfig
): Promise<RelatedTermsResponse> => {
  if (!words) {
    return { words: [] }
  }

  const { data } = await api.get<RelatedTermsResponse>(
    `${RELATED_TERMS_API_PATH}?terms=${words}`,
    config
  )

  // Remove duplicates
  const result = [
    ...data.words
      .reduce((map, term) => map.set(term.similar_word, term), new Map<string, SimilarTerm>())
      .values()
  ]

  return {
    words: result
  }
}

export const useRelatedTerms = (words?: string) =>
  useQuery({ queryKey: queryKey.words(words), queryFn: () => getRelatedTerms(words) })
