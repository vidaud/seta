import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'

export type DocumentsTreeOptions = {
  foldersOnly?: boolean
  selectable?: boolean
  autoSelectRoot?: boolean
  toggleable?: boolean
  disabledIds?: string[]
  disabledBadge?: string
  noActionMenu?: boolean
}

type DocumentsTreeProviderProps = DocumentsTreeOptions & {
  rootNode?: LibraryItem
  selected: LibraryItem | undefined
  onSelect: (value?: LibraryItem) => void
  selectChild: (parent: LibraryItem, childId: string) => void
}

type DocumentsTreeContextProps = DocumentsTreeProviderProps

const DocumentsTreeContext = createContext<DocumentsTreeContextProps | undefined>(undefined)

export const DocumentsTreeProvider = ({
  children,
  ...props
}: DocumentsTreeProviderProps & ChildrenProp) => (
  <DocumentsTreeContext.Provider value={props}>{children}</DocumentsTreeContext.Provider>
)

export const useDocumentsTree = () => {
  const context = useContext(DocumentsTreeContext)

  if (context === undefined) {
    throw new Error('useDocumentsTree must be used within a DocumentsTreeProvider')
  }

  return context
}
