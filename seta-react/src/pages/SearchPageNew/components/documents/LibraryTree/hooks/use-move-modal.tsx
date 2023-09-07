import { useEffect, useState } from 'react'

import { ROOT_NODE_ID } from '~/pages/SearchPageNew/components/documents/LibraryTree/constants'
import SaveDocumentsModal from '~/pages/SearchPageNew/components/documents/SaveDocumentsModal'

import { useUpdateItem } from '~/api/search/library'
import useComplexModalState from '~/hooks/use-complex-modal-state'
import type { LibraryItem } from '~/types/library/library-item'

const useMoveModal = () => {
  const {
    open,
    openModal,
    closeModal,
    modalState: libraryItem
  } = useComplexModalState<LibraryItem>(undefined)

  const [hasError, setHasError] = useState(false)

  const { mutate, isLoading } = useUpdateItem()

  // Reset the error state when closing the modal
  useEffect(() => {
    if (!open) {
      setHasError(false)
    }
  }, [open])

  const moveItem = (item: LibraryItem) => {
    openModal(item)
  }

  const handleMove = (target: LibraryItem) => {
    if (!libraryItem) {
      return
    }

    const parentId = target.id === ROOT_NODE_ID ? null : target.id

    setHasError(false)

    mutate(
      { ...libraryItem, parentId },
      {
        onSuccess: () => {
          closeModal()
        },

        onError: () => {
          setHasError(true)
        }
      }
    )
  }

  const moveError = hasError ? `There was an error moving '${libraryItem?.title}'.` : undefined

  const moveModal = (
    <SaveDocumentsModal
      libraryItem={libraryItem}
      opened={open}
      saving={isLoading}
      saveError={moveError}
      onClose={closeModal}
      onSave={handleMove}
    />
  )

  return {
    moveItem,
    moveModal
  }
}

export default useMoveModal
