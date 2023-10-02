import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'
import { STORAGE_KEY } from '~/pages/SearchPageNew/utils/constants'

import type { ChildrenProp } from '~/types/children-props'
import { toggleArrayValue } from '~/utils/array-utils'
import { storage } from '~/utils/storage-utils'

type StagedDocumentsContextProps = {
  isStaged: (documentId: string) => boolean

  toggleStaged: (
    documentId: string,
    documentTitle: string,
    link: string | undefined | null,
    staged: boolean
  ) => void

  removeStaged: (documentId: string | string[]) => void
  clearStaged: () => void
  stagedDocuments: StagedDocument[]
}

const WRITE_STORAGE_DELAY = 50

const stagedDocsStorage = storage<StagedDocument[]>(STORAGE_KEY.STAGED_DOCS)

const StagedDocumentsContext = createContext<StagedDocumentsContextProps | undefined>(undefined)

/**
 * Keep track of staged documents in local storage.
 */
export const StagedDocumentsProvider = ({ children }: ChildrenProp) => {
  const [stagedDocuments, setStagedDocuments] = useState<StagedDocument[]>([])

  useEffect(() => {
    const stagedDocs = stagedDocsStorage.read()

    if (stagedDocs) {
      setStagedDocuments(stagedDocs)
    }
  }, [])

  const isStaged: StagedDocumentsContextProps['isStaged'] = useCallback(
    documentId => stagedDocuments.some(({ id }) => id === documentId),
    [stagedDocuments]
  )

  const toggleStaged: StagedDocumentsContextProps['toggleStaged'] = useCallback(
    (documentId, documentTitle, link, staged) => {
      const doc: StagedDocument = {
        id: documentId,
        title: documentTitle,
        link
      }

      const newStagedDocs = toggleArrayValue(stagedDocuments, doc, staged, 'id')

      setStagedDocuments(newStagedDocs)

      setTimeout(() => {
        stagedDocsStorage.write(newStagedDocs)
      }, WRITE_STORAGE_DELAY)
    },
    [stagedDocuments]
  )

  const removeStaged: StagedDocumentsContextProps['removeStaged'] = useCallback(
    documentId => {
      const ids = Array.isArray(documentId) ? documentId : [documentId]
      const newStagedDocs = stagedDocuments.filter(({ id }) => !ids.includes(id))

      setStagedDocuments(newStagedDocs)

      setTimeout(() => {
        stagedDocsStorage.write(newStagedDocs)
      }, WRITE_STORAGE_DELAY)
    },
    [stagedDocuments]
  )

  const clearStaged: StagedDocumentsContextProps['clearStaged'] = () => {
    setStagedDocuments([])
    stagedDocsStorage.write([])
  }

  const value: StagedDocumentsContextProps = {
    isStaged,
    toggleStaged,
    removeStaged,
    clearStaged,
    stagedDocuments
  }

  return <StagedDocumentsContext.Provider value={value}>{children}</StagedDocumentsContext.Provider>
}

/**
 * Hook to access the staged documents context
 */
export const useStagedDocuments = () => {
  const context = useContext(StagedDocumentsContext)

  if (!context) {
    throw new Error('useStagedDocuments must be used within a StagedDocumentsProvider')
  }

  return context
}
