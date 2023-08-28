import { useCallback, useState } from 'react'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import { toggleArrayValue } from '~/utils/array-utils'

const useSelectedDocs = (stagedDocuments: StagedDocument[]) => {
  const [selectedDocs, setSelectedDocs] = useState<StagedDocument[]>([])

  const isSelected = useCallback(
    (doc: StagedDocument) => selectedDocs.some(({ id }) => id === doc.id),
    [selectedDocs]
  )

  const toggleSelected = (selected: boolean, doc: StagedDocument) => {
    setSelectedDocs(toggleArrayValue(selectedDocs, doc, selected, 'id'))
  }

  const handleSelectAll = () => {
    setSelectedDocs([...stagedDocuments])
  }

  const handleSelectNone = () => {
    setSelectedDocs([])
  }

  const selectNoneDelayed = () => {
    // Delay the select none action to allow the popup's closing animation to finish
    setTimeout(handleSelectNone, 200)
  }

  const clearSelectedDocs = () => {
    setSelectedDocs([])
  }

  return {
    selectedDocs,
    setSelectedDocs,
    clearSelectedDocs,
    isSelected,
    toggleSelected,
    handleSelectAll,
    handleSelectNone,
    selectNoneDelayed
  }
}

export default useSelectedDocs
