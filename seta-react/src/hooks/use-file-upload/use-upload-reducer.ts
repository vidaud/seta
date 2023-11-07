import { useReducer } from 'react'

import type { FileEmbeddingsProgressInfo } from '~/api/embeddings/embedding-info'
import type { EmbeddingInfo } from '~/types/embeddings'

type State = {
  documents: EmbeddingInfo[] | undefined
  progress: FileEmbeddingsProgressInfo | null
  error: Error | undefined
  loading: boolean
}

type Action =
  // Start uploading
  | { type: 'upload-start' }
  // Set the upload progress
  | { type: 'set-progress'; progress: FileEmbeddingsProgressInfo }
  // Upload finished
  | { type: 'upload-finished'; documents: EmbeddingInfo[] }
  // Error
  | { type: 'error'; error: Error }

const initialState: State = {
  documents: undefined,
  progress: null,
  error: undefined,
  loading: false
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'upload-start': {
      return {
        ...state,
        documents: undefined,
        progress: null,
        error: undefined,
        loading: true
      }
    }

    case 'set-progress': {
      return {
        ...state,
        progress: action.progress,
        loading: true
      }
    }

    case 'upload-finished': {
      return {
        ...state,
        documents: action.documents,
        progress: null,
        loading: false
      }
    }

    case 'error': {
      return {
        ...state,
        error: action.error,
        progress: null,
        loading: false
      }
    }

    default: {
      return state
    }
  }
}

const useUploadReducer = () => useReducer(reducer, initialState)

export default useUploadReducer
