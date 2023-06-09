import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '@mantine/hooks'

import {
  getFilesEmbeddingInfo,
  type FileEmbeddingsProgressInfo,
  getTextEmbeddingInfo
} from '~/api/embeddings/embedding-info'
import type { ChildrenProp } from '~/types/children-props'
import type { EmbeddingInfo } from '~/types/embeddings'

import { STORAGE_KEY } from '../utils/constants'

export enum LoadingType {
  DOCUMENTS = 'documents',
  TEXT = 'text'
}

type UploadDocumentsContextProps = {
  uploadFiles: (files: File[]) => Promise<void>
  uploadText: (text: string) => Promise<void>
  progress: FileEmbeddingsProgressInfo | null
  loading: LoadingType | null
  documents: EmbeddingInfo[]
  removeChunk: (chunkId: string) => void
  removeDocument: (id: string) => void
  removeAll: () => void
}

const UploadDocumentsContext = createContext<UploadDocumentsContextProps | undefined>(undefined)

export const UploadDocumentsProvider = ({ children }: ChildrenProp) => {
  const [documents, setDocuments] = useLocalStorage<EmbeddingInfo[]>({
    key: STORAGE_KEY.UPLOADS,
    defaultValue: [],
    getInitialValueInEffect: true
  })

  const [loading, setLoading] = useState<LoadingType | null>(null)
  const [progress, setProgress] = useState<FileEmbeddingsProgressInfo | null>(null)

  const uploadFiles = async (files: File[]) => {
    setLoading(LoadingType.DOCUMENTS)

    const docs = await getFilesEmbeddingInfo(files, {
      onProgress: setProgress,
      existing: documents
    })

    // Allow the 100% step to be shown for a second
    setTimeout(() => {
      setProgress(null)
      setDocuments(prev => [...prev, ...docs])
      setLoading(null)
    }, 1000)
  }

  const uploadText = async (text: string) => {
    setLoading(LoadingType.TEXT)

    const doc = await getTextEmbeddingInfo(text, { existing: documents })

    setDocuments(prev => [...prev, doc])
    setLoading(null)
  }

  const removeChunk = (chunkId: string) => {
    const docs = [...documents]

    const itemIndex = docs.findIndex(doc => doc.chunks?.some(chunk => chunk.id === chunkId))

    if (itemIndex === -1) {
      return
    }

    const item = docs[itemIndex]

    if (!item.chunks) {
      return
    }

    const newChunks = item.chunks.filter(c => c.id !== chunkId)

    if (newChunks.length === 0) {
      docs.splice(itemIndex, 1)
    } else {
      item.chunks = newChunks
    }

    setDocuments(docs)
  }

  const removeDocument = (id: string) => setDocuments(prev => prev.filter(doc => doc.id !== id))

  const removeAll = () => setDocuments([])

  const value: UploadDocumentsContextProps = {
    documents,
    uploadFiles,
    uploadText,
    progress,
    loading,
    removeChunk,
    removeDocument,
    removeAll
  }

  return <UploadDocumentsContext.Provider value={value}>{children}</UploadDocumentsContext.Provider>
}

export const useUploadDocuments = () => {
  const context = useContext(UploadDocumentsContext)

  if (context === undefined) {
    throw new Error('useUploadedDocuments must be used within an UploadedDocumentsProvider')
  }

  return context
}
