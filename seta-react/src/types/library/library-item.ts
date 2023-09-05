export enum LibraryItemType {
  Document = 'document',
  Folder = 'folder'
}

export type LibraryItemBase = {
  id: string
  title: string
  parentId: string | null
}

type LibraryFolderRaw = LibraryItemBase & {
  order: number

  type: string
}

export type LibraryItemRaw = LibraryFolderRaw & {
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
