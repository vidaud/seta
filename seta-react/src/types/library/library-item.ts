export enum LibraryItemType {
  Folder = 0,
  Document = 1
}

export type LibraryItemCreate = {
  type: LibraryItemType
  parentId: string | null
  title: string
  documentId?: string
  link?: string | null
}

export type LibraryItemUpdate = LibraryItemCreate & {
  id: string
}

export type LibraryItem = LibraryItemUpdate & {
  path: string[]
} & ( // Discriminated union to only allow children on folders
    | {
        type: LibraryItemType.Document
      }
    | {
        type: LibraryItemType.Folder
        children: LibraryItem[]
      }
  )
