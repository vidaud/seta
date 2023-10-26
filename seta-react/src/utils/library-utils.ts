import type { LibraryItemExport } from '~/types/library/library-export'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'

export const ROOT_LIBRARY_ITEM_NAME = 'My Library'

export const getDocumentsForExport = (libraryItem: LibraryItem): LibraryItemExport[] => {
  const dict: Map<string, LibraryItemExport> = new Map()

  const traverse = (item: LibraryItem): void => {
    if (item.type === LibraryItemType.Document) {
      const { documentId, path } = item

      if (documentId) {
        const value: LibraryItemExport = dict.get(documentId) ?? {
          documentId,
          paths: []
        }

        // Remove the last item from the path, which is the document name
        const formattedPath = path.slice(0, -1).join(' / ')

        if (!value.paths.includes(formattedPath)) {
          value.paths.push(formattedPath)
        }

        dict.set(documentId, value)
      }
    } else {
      item.children.forEach(child => {
        traverse(child)
      })
    }
  }

  traverse(libraryItem)

  return Array.from(dict.values())
}
