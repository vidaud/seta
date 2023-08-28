export enum LibraryItemType {
  Document = 'document',
  Folder = 'folder'
}

export type LibraryItemBase = {
  id: string
  title: string
}

export type LibraryItemRaw = LibraryItemBase & {
  order: number
  parentId: string | null
  type: string
  documentId?: string
  link?: string | null
}

export type LibraryItem = LibraryItemBase & {
  order: number
  parent?: LibraryItem | null
  path: string[]
} & (
    | {
        type: LibraryItemType.Document
        documentId: string
        link: string | null
      }
    | {
        type: LibraryItemType.Folder
        children: LibraryItem[]
      }
  )
