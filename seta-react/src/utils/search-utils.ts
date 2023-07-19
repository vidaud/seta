import type { EnrichedStatus } from '~/pages/SearchPageNew/types/search'
import { EnrichType } from '~/pages/SearchPageNew/types/search'
import { TokenOperator } from '~/pages/SearchPageNew/types/token'
import type { Token } from '~/pages/SearchPageNew/types/token'

import { getEnrichedTerms } from '~/api/search/query'
import type { EmbeddingInfo } from '~/types/embeddings'

const mapGroupsToQuery = (groups: string[][]): string =>
  groups.map(group => `(${group.join(' OR ')})`).join(' AND ')

const removeQuotes = (term: string): string => term.replace(/"/g, '')

const enrichGroups = async (groups: string[][]): Promise<string[][]> =>
  await Promise.all(
    groups.map(async group => {
      // Prepare terms for the enrichment API by removing quotes
      const rawTerms = group.map(removeQuotes)

      // TODO: Replace `EnrichType.Similar` with `enrichedStatus.type` once the API returns the results in a reasonable time
      const enrichedTerms = (await getEnrichedTerms(rawTerms, EnrichType.Similar)).words

      // Place expressions back in quotes
      const formattedEnrichedTerms = enrichedTerms.map(term =>
        term.match(/\s/) ? `"${term}"` : term
      )

      return [...group, ...formattedEnrichedTerms]
    })
  )

const getQueryAndTermsFromTokens = async (
  tokens: Token[],
  enrichedStatus?: EnrichedStatus
): Promise<[string, string[]]> => {
  const groups: string[][] = [[]]
  const terms: string[] = []

  // Exit early if there are no tokens to search for
  if (!tokens.length) {
    return ['', []]
  }

  for (const [index, token] of tokens.entries()) {
    const { operator, token: value } = token

    const lastGroup = groups[groups.length - 1]

    if (operator === TokenOperator.AND) {
      // Disallow creation of empty groups
      if (index !== 0 && index !== tokens.length - 1 && lastGroup.length) {
        groups.push([])
      }

      continue
    }

    if (operator === TokenOperator.OR) {
      continue
    }

    // Remove odd quotes
    const formattedValue = value.match(/^".*[^"]$|^[^"].*"$/) ? removeQuotes(value) : value

    lastGroup.push(formattedValue)
    terms.push(removeQuotes(value))
  }

  // Clean up empty groups caused by consecutive `AND` operators at the end
  // or by having only `AND`/`OR` operators in the query
  while (groups[groups.length - 1]?.length === 0) {
    groups.pop()
  }

  // Exit early if there are no groups
  if (!groups.length) {
    return ['', []]
  }

  if (enrichedStatus?.enriched) {
    const enrichedGroups = await enrichGroups(groups)
    const enrichedTerms = enrichedGroups.flat().map(removeQuotes)

    return [mapGroupsToQuery(enrichedGroups), enrichedTerms]
  }

  return [mapGroupsToQuery(groups), terms]
}

export const getSearchQueryAndTerms = async (
  tokens: Token[],
  enrichedStatus?: EnrichedStatus
): Promise<{ query: string; terms: string[] }> => {
  const [query, terms] = await getQueryAndTermsFromTokens(tokens, enrichedStatus)

  return { query, terms }
}

export const getEmbeddingsVectors = (
  embeddings: EmbeddingInfo[] | undefined
): number[][] | undefined =>
  embeddings?.reduce<number[][]>((acc, { chunks }) => {
    const chunkVectors = chunks?.map(({ vector }) => vector) ?? []

    return [...acc, ...chunkVectors]
  }, [])
