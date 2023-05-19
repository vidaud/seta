import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import type { RelatedTerm } from '~/types/search/related-term'

const RELATED_CLUSTERS_API_PATH = '/ontology-list'

export type RelatedClustersResponse = {
  nodes: RelatedTerm[][]
}

export const queryKey = {
  root: 'related-clusters',
  words: (words?: string) => [queryKey.root, words]
}

const getRelatedClusters = async (
  words?: string,
  config?: AxiosRequestConfig
): Promise<RelatedClustersResponse> => {
  if (!words) {
    return { nodes: [] }
  }

  const { data } = await api.get<RelatedClustersResponse>(
    `${RELATED_CLUSTERS_API_PATH}?term=${words}`,
    config
  )

  // Remove duplicates
  return {
    nodes: data.nodes.map(node => [...new Set(node)])
  }
}

// Passing the `signal` makes the request cancelable
export const useRelatedClusters = (words?: string) =>
  useQuery({
    queryKey: queryKey.words(words),
    queryFn: ({ signal }) => getRelatedClusters(words, { signal })
  })
