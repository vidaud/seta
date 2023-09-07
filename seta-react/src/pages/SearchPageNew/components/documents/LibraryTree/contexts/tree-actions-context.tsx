import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'

import useDeleteModal from '../hooks/use-delete-modal'
import useMoveModal from '../hooks/use-move-modal'
import useRenameModal from '../hooks/use-rename-modal'

type TreeActionsContextProps = {
  renameFolder: (folder: LibraryItem) => void
  confirmDelete: (item: LibraryItem) => void
  moveItem: (item: LibraryItem) => void
}

const TreeActionsContext = createContext<TreeActionsContextProps | undefined>(undefined)

const TreeActionsProvider = ({ children }: ChildrenProp) => {
  const { renameFolder, renameModal } = useRenameModal()
  const { confirmDelete, confirmDeleteModal } = useDeleteModal()
  const { moveItem, moveModal } = useMoveModal()

  const value: TreeActionsContextProps = {
    renameFolder,
    confirmDelete,
    moveItem
  }

  return (
    <>
      <TreeActionsContext.Provider value={value}>{children}</TreeActionsContext.Provider>

      {renameModal}
      {confirmDeleteModal}
      {moveModal}
    </>
  )
}

export const useTreeActions = () => {
  const context = useContext(TreeActionsContext)

  if (context === undefined) {
    throw new Error('useTreeActions must be used within a TreeActionsProvider')
  }

  return context
}

// Must be exported default to work with React.lazy
export default TreeActionsProvider
