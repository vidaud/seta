import type { EnrichedStatus } from '~/pages/SearchPageNew/types/search'
import { EnrichType } from '~/pages/SearchPageNew/types/search'
import type { Token } from '~/pages/SearchPageNew/types/token'

import { getEnrichedTerms } from '~/api/search/query'
import type { EmbeddingInfo } from '~/types/embeddings'

export const buildSearchQueryFromTerms = (terms: string[]): string =>
  terms.map(term => (term.match(/\s/) ? `"${term}"` : term)).join(' OR ')

export const getSearchQueryAndTerms = async (
  tokens: Token[],
  enrichedStatus?: EnrichedStatus
): Promise<{ query: string; terms: string[] }> => {
  const selfTerms = tokens.map(({ rawValue }) => rawValue)

  const enrichedTerms = enrichedStatus?.enriched
    ? // TODO: Replace `EnrichType.Similar` with `enrichedStatus.type` once the API returns the results in a reasonable time
      (await getEnrichedTerms(selfTerms, EnrichType.Similar)).words
    : []

  const terms = [...selfTerms, ...enrichedTerms]
  const query = buildSearchQueryFromTerms(terms)

  return { query, terms }
}

export const getEmbeddingsVectors = (
  embeddings: EmbeddingInfo[] | undefined
): number[][] | undefined =>
  embeddings?.reduce<number[][]>((acc, { chunks }) => {
    const chunkVectors = chunks?.map(({ vector }) => vector) ?? []

    return [...acc, ...chunkVectors]
  }, [])
