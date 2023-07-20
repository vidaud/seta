import { useState } from 'react'
import { css } from '@emotion/react'
import { CgRemoveR } from 'react-icons/cg'

import ConfirmModal from '~/components/ConfirmModal'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

type RemoveModalState =
  | {
      open: false
    }
  | {
      open: true
      type: 'document'
      doc: StagedDocument
    }
  | {
      open: true
      type: 'selected'
      docs: StagedDocument[]
    }
  | {
      open: true
      type: 'all'
    }

let lastRemoveInfo: [string, string, string] = ['', '', '']

const getRemoveInfo = (state: RemoveModalState): [string, string, string] => {
  if (!state.open) {
    // If the modal is closed, return the last info so that
    // the text doesn't change until the closing animation is finished
    return lastRemoveInfo
  }

  switch (state.type) {
    case 'document':
      lastRemoveInfo = ['document', 'this document from the list', 'it']
      break

    case 'selected':
      lastRemoveInfo = [
        `${state.docs.length} documents`,
        `${state.docs.length} documents from the list`,
        'them'
      ]

      break

    case 'all':
      lastRemoveInfo = ['all staged', 'all the staged documents', 'them']
      break
  }

  return lastRemoveInfo
}

const removeIconStyle: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  font-size: 3.2rem;
`

type Args = {
  selectedDocs: StagedDocument[]
  clearSelectedDocs: () => void
  toggleSelected: (selected: boolean, doc: StagedDocument) => void
  removeStaged: (ids: string | string[]) => void
  clearStaged: () => void
}

const useRemoveDocsModal = ({
  selectedDocs,
  clearSelectedDocs,
  toggleSelected: toggleSelectedDoc,
  removeStaged,
  clearStaged
}: Args) => {
  const [removeModal, setRemoveModal] = useState<RemoveModalState>({ open: false })

  const handleRemoveAll = () => {
    setRemoveModal({ open: true, type: 'all' })
  }

  const handleRemoveSelected = () => {
    if (selectedDocs.length === 1) {
      setRemoveModal({ open: true, type: 'document', doc: selectedDocs[0] })
    } else {
      setRemoveModal({ open: true, type: 'selected', docs: selectedDocs })
    }
  }

  const handleRemoveOne = (doc: StagedDocument) => {
    setRemoveModal({ open: true, type: 'document', doc })
  }

  const closeRemoveModal = () => {
    setRemoveModal({ open: false })
  }

  const handleRemoveStaged = () => {
    if (!removeModal.open) {
      return
    }

    switch (removeModal.type) {
      case 'document':
        const doc = removeModal.doc

        toggleSelectedDoc(false, doc)
        removeStaged(doc.id)
        break

      case 'selected':
        const docs = removeModal.docs

        removeStaged(docs.map(d => d.id))
        clearSelectedDocs()
        break

      case 'all':
        clearStaged()
        break
    }

    closeRemoveModal()
  }

  const [removeName, removeText, removeSecondary] = getRemoveInfo(removeModal)
  const removeModalText = `Are you sure you want to remove ${removeText}?`

  const confirmRemoveModal = (
    <ConfirmModal
      icon={<CgRemoveR css={removeIconStyle} />}
      text={removeModalText}
      secondary={`You can add ${removeSecondary} back later from the search results.`}
      confirmLabel={`Remove ${removeName}`}
      confirmColor="red"
      withinPortal={false}
      zIndex={1000}
      opened={removeModal.open}
      onClose={closeRemoveModal}
      onConfirm={handleRemoveStaged}
    />
  )

  return {
    handleRemoveAll,
    handleRemoveSelected,
    handleRemoveOne,
    confirmRemoveModal
  }
}

export default useRemoveDocsModal
