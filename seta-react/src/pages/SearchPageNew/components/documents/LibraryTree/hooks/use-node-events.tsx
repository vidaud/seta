import type { Dispatch, SetStateAction } from 'react'

import type { LibraryItem } from '~/types/library/library-item'

type Args = {
  item: LibraryItem
  children: LibraryItem[]
  selectable: boolean | undefined
  toggleable: boolean | undefined
  isRoot: boolean | undefined
  isFolder: boolean
  isDisabled: boolean | undefined
  isExpanded: boolean
  selected?: LibraryItem
  onSelect?: (value?: LibraryItem) => void
  setWillSelectId: Dispatch<SetStateAction<string | null>>
  setIsExpanded: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  collapseAllFolders: () => void
}

const useNodeEvents = ({
  item,
  children,
  selectable,
  toggleable,
  isRoot,
  isFolder,
  isDisabled,
  isExpanded,
  selected,
  onSelect,
  setWillSelectId,
  setIsExpanded,
  setIsLoading,
  collapseAllFolders
}: Args) => {
  const handleTitleClick = () => {
    if (isDisabled) {
      return
    }

    if (isFolder) {
      setIsExpanded(prev => !prev)
    }

    if (selectable) {
      if (toggleable) {
        const isAlreadySelected = selected?.id === item.id
        const itemValue = isAlreadySelected ? undefined : item

        onSelect?.(itemValue)

        return
      }

      if (selected?.id !== item.id) {
        onSelect?.(item)
      }
    }
  }

  const handleCreatingNewFolder = () => {
    setIsLoading(true)

    // Collapse the node to correctly show the new folder after it's created
    if (isExpanded && !isRoot && !children.length) {
      setIsExpanded(false)
    }
  }

  const handleNewFolderCreated = (folderId: string) => {
    setIsLoading(false)
    setIsExpanded(true)

    if (selectable) {
      setWillSelectId(folderId)
    }
  }

  const handleCollapseAllFolders = () => {
    if (isRoot) {
      collapseAllFolders()
    }
  }

  return {
    handleTitleClick,
    handleCreatingNewFolder,
    handleNewFolderCreated,
    handleCollapseAllFolders
  }
}

export default useNodeEvents
