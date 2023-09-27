import { useEffect, useRef, useState } from 'react'

import SaveDocumentsModal from '~/pages/SearchPageNew/components/documents/SaveDocumentsModal'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import { useSaveDocuments } from '~/api/search/library'
import type { LibraryItem } from '~/types/library/library-item'
import { notifications } from '~/utils/notifications'

type Args = {
  selectedDocs: StagedDocument[]
  clearSelectedDocs?: () => void
  removeStaged?: (ids: string | string[]) => void
}

const useSaveDocsModal = ({ selectedDocs, clearSelectedDocs, removeStaged }: Args) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Use internal state to allow it to be set by the `handleSave` callback
  const [internalDocs, setInternalDocs] = useState<StagedDocument[]>()

  const lastTargetRef = useRef<LibraryItem | undefined>()

  const { mutate, isLoading } = useSaveDocuments()

  // Reset the error state when closing the modal
  useEffect(() => {
    if (!modalOpen) {
      setHasError(false)
    }
  }, [modalOpen])

  const handleSave = (docs?: StagedDocument[]) => {
    // Prevent default event argument from being passed using Array.isArray check
    if (docs && Array.isArray(docs)) {
      setInternalDocs(docs)
    }

    setModalOpen(true)
  }

  // Use internal docs if set, otherwise use selected docs from prop
  const docs = internalDocs ?? selectedDocs

  const handleSaveDocuments = (target: LibraryItem) => {
    lastTargetRef.current = target
    setHasError(false)

    mutate(
      {
        parentId: target.id === 'root' ? null : target.id,
        documents: docs.map(({ id, title }) => ({ documentId: id, title }))
      },
      {
        onSuccess: () => {
          setModalOpen(false)

          removeStaged?.(docs.map(({ id }) => id))
          clearSelectedDocs?.()

          const message =
            docs.length === 1
              ? 'The document was saved to your library.'
              : `${docs.length} documents were saved to your library.`

          notifications.showSuccess(message)
        },

        onError: () => {
          setHasError(true)
        }
      }
    )
  }

  const saveError = hasError
    ? `There was an error saving to '${lastTargetRef.current?.path.join(' / ')}'.`
    : undefined

  const saveModal = (
    <SaveDocumentsModal
      documents={docs}
      withinPortal={false}
      opened={modalOpen}
      saving={isLoading}
      saveError={saveError}
      onClose={() => setModalOpen(false)}
      onSave={handleSaveDocuments}
    />
  )

  return {
    handleSave,
    saveModal
  }
}

export default useSaveDocsModal
