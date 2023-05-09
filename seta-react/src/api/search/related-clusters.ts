import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { RelatedTerm } from '~/models/related-term'

const RELATED_CLUSTERS_API_PATH = '/ontology-list'

export type RelatedClustersResponse = {
  nodes: RelatedTerm[][]
}

export const cacheKey = (words?: string) => ['related-clusters', words]

const getRelatedClusters = async (words?: string): Promise<RelatedClustersResponse> => {
  if (!words) {
    return { nodes: [] }
  }

  const { data } = await api.get<RelatedClustersResponse>(
    `${RELATED_CLUSTERS_API_PATH}?term=${words}`
  )

  // Remove duplicates
  return {
    nodes: data.nodes.map(node => [...new Set(node)])
  }
}

export const useRelatedClusters = (words?: string) =>
  useQuery(cacheKey(words), () => getRelatedClusters(words))
