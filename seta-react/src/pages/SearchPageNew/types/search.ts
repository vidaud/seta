import type { Token } from './token'

export enum EnrichType {
  Similar = 'similar',
  Ontology = 'ontology'
}

export type EnrichedStatus = {
  enriched: boolean
  type: EnrichType
}

export type SearchValue = {
  value: string
  tokens: Token[]
  enrichedStatus: EnrichedStatus
}
