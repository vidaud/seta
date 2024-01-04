import type { AxiosRequestConfig } from 'axios'

import { getEmbeddings } from '~/api/embeddings/embedding'
import { getTextFromFile } from '~/api/embeddings/file-to-text'
import { EmbeddingType } from '~/types/embeddings'
import type { ChunkInfo, Embedding, EmbeddingId, EmbeddingInfo } from '~/types/embeddings'
import { getLastId, getNextId, incrementId } from '~/utils/embedding-utils'
import { trimText } from '~/utils/string-utils'

export type FileEmbeddingsProgressInfo = {
  done: number
  total: number
  percent: number
  info?: string | JSX.Element
}

type Config = AxiosRequestConfig & {
  onProgress?: (info: FileEmbeddingsProgressInfo) => void
  existing?: EmbeddingInfo[]
}

const MAX_CHUNK_WIDTH = 200
const MAX_TITLE_WIDTH = 70

type Options = {
  embeddings: Embedding[]
  type: EmbeddingType
  name: string
  text: string
  nextId?: EmbeddingId
}

const embeddingsToDoc = ({ embeddings, type, name, text, nextId }: Options): EmbeddingInfo => {
  const id = nextId ?? getNextId(type, undefined)

  const chunks: ChunkInfo[] = embeddings.map(({ chunk, vector, version, text: chunkText }) => ({
    id: `${id}-C${chunk}`,
    chunk,
    vector,
    version,
    text: chunkText,
    brief: trimText(chunkText, MAX_CHUNK_WIDTH)
  }))

  return {
    id,
    type,
    name,
    text,
    chunks
  }
}

export const getFilesEmbeddingInfo = async (
  files?: File[],
  { onProgress, existing, ...config }: Config = {}
): Promise<EmbeddingInfo[]> => {
  if (!files) {
    return []
  }

  const documents: EmbeddingInfo[] = []

  const reportProgress = (delta: number, info: string) =>
    onProgress?.({
      done: documents.length * 2 + delta,
      total: files.length * 2,
      percent: ((documents.length * 2 + delta) / (files.length * 2)) * 100,
      info
    })

  let lastId = getLastId(EmbeddingType.File, existing)

  for (const file of files) {
    // First retrieve the text from each file

    reportProgress(0, `Extracting text from ${file.name} ...`)

    const text = await getTextFromFile(file, config)

    const normalizedText = text
      .split('\n')
      .filter(Boolean)
      .map(value => `"${value}"`)
      .join(' ')

    // Then retrieve the embeddings from the text

    reportProgress(1, `Retrieving embeddings for ${file.name} ...`)

    const { emb_with_chunk_text: embeddings } = await getEmbeddings(text, config)

    const doc = embeddingsToDoc({
      embeddings,
      type: EmbeddingType.File,
      name: file.name,
      text: normalizedText,
      nextId: incrementId(lastId)
    })

    documents.push(doc)

    lastId = doc.id
  }

  reportProgress(0, 'Done.')

  return documents
}

export const getTextEmbeddingInfo = async (
  text: string,
  config?: Config
): Promise<EmbeddingInfo> => {
  const { emb_with_chunk_text: embeddings } = await getEmbeddings(text, config)

  const name = trimText(text, MAX_TITLE_WIDTH)

  return embeddingsToDoc({
    embeddings,
    type: EmbeddingType.Text,
    name,
    text,
    nextId: getNextId(EmbeddingType.Text, config?.existing)
  })
}
