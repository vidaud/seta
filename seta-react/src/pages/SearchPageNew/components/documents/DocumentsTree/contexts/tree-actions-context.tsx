import { createContext, useContext } from 'react'

import { useCreateNewFolder } from '~/api/search/library'
import type { ChildrenProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'

import useDeleteModal from '../hooks/use-delete-modal'
import useRenameModal from '../hooks/use-rename-modal'

type TreeActionsContextProps = {
  createNewFolder: (parentId: string | null, title: string) => Promise<string>
  renameFolder: (folder: LibraryItem) => void
  confirmDelete: (folder: LibraryItem) => void
}

const TreeActionsContext = createContext<TreeActionsContextProps | undefined>(undefined)

export const TreeActionsProvider = ({ children }: ChildrenProp) => {
  const { mutateAsync: createNewFolderMutation } = useCreateNewFolder()

  const { renameFolder, renameModal } = useRenameModal()
  const { confirmDelete, confirmDeleteModal } = useDeleteModal()

  const createNewFolder: TreeActionsContextProps['createNewFolder'] = async (parentId, title) => {
    const { item } = await createNewFolderMutation({ parentId, title })

    return item.id
  }

  const value: TreeActionsContextProps = {
    createNewFolder,
    renameFolder,
    confirmDelete
  }

  return (
    <>
      <TreeActionsContext.Provider value={value}>{children}</TreeActionsContext.Provider>

      {renameModal}
      {confirmDeleteModal}
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
