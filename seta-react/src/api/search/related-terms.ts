import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { RelatedTerm } from '~/models/related-term'

const RELATED_TERMS_API_PATH = '/ontology-list'

export type RelatedTermsResponse = {
  nodes: RelatedTerm[][]
}

export const cacheKey = (words?: string) => ['related-terms', words]

const getRelatedTerms = async (words?: string): Promise<RelatedTermsResponse> => {
  if (!words) {
    return { nodes: [] }
  }

  const { data } = await api.get<RelatedTermsResponse>(`${RELATED_TERMS_API_PATH}?term=${words}`)

  // Remove duplicates
  return {
    nodes: data.nodes.map(node => [...new Set(node)])
  }
}

export const useRelatedTerms = (words?: string) =>
  useQuery(cacheKey(words), () => getRelatedTerms(words))
