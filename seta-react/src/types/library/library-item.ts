// TODO: Change this to a numeric enum, where Folder = 0 and Document = 1
export enum LibraryItemType {
  Document = 'document',
  Folder = 'folder'
}

export type LibraryItemBase = {
  id: string
  title: string
  parentId: string | null
}

export type LibraryItemRaw = LibraryItemBase & {
  order: number
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
