import {
  EmbeddingPrefixMapping,
  type EmbeddingId,
  type EmbeddingIdPrefix,
  type EmbeddingInfo,
  type EmbeddingType
} from '~/types/embeddings'

const getLastIdParts = (
  type: EmbeddingType,
  existing: EmbeddingInfo[] | undefined
): [EmbeddingIdPrefix, number] => {
  const prefix = EmbeddingPrefixMapping[type]

  const lastId = existing
    ?.filter(({ type: t }) => t === type)
    .map(({ id }) => parseInt(id.slice(1)))
    .sort((a, b) => b - a)[0]

  return [prefix, lastId ?? 0]
}

export const getLastId = (
  type: EmbeddingType,
  existing: EmbeddingInfo[] | undefined
): EmbeddingId => {
  const [prefix, lastId] = getLastIdParts(type, existing)

  return `${prefix}${lastId ?? 0}`
}

export const getNextId = (
  type: EmbeddingType,
  existing: EmbeddingInfo[] | undefined
): EmbeddingId => {
  const [prefix, lastId] = getLastIdParts(type, existing)

  return `${prefix}${(lastId ?? 0) + 1}`
}

export const incrementId = (embeddingId: EmbeddingId): EmbeddingId => {
  const id = parseInt(embeddingId.slice(1))
  const prefix = embeddingId[0] as EmbeddingIdPrefix

  return `${prefix}${id + 1}`
}
