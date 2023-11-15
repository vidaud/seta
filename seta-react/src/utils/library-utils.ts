import type { LibraryItemExport } from '~/types/library/library-export'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'

// The name of the root library item to display in the UI
export const ROOT_LIBRARY_ITEM_NAME = 'My Library'

// Characters that are not allowed in folder names, to avoid confusion in the UI and in the exported files
export const INVALID_PATH_CHARACTERS = ['/', '\\', '"', ',', ';']

// The path to use as the root library folder in the exported files
const HOME_PATH = '~'

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
        const curatedPath = path.slice(0, -1).join('/')

        const formattedPath = curatedPath ? `${HOME_PATH}/${curatedPath}` : HOME_PATH

        // Add all the unique paths where this document is located at in the library
        if (!value.paths.includes(formattedPath)) {
          value.paths.push(formattedPath)
        }

        // Keep the records unique by `documentId`
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
