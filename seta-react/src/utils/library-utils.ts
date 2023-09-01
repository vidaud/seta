import { LibraryItemType } from '~/types/library/library-item'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'

export const ROOT_LIBRARY_ITEM_NAME = 'My Library'

const itemFromRaw = (item: LibraryItemRaw): LibraryItem => {
  const base = {
    ...item,
    path: [ROOT_LIBRARY_ITEM_NAME, item.title]
  }

  if (item.type === LibraryItemType.Folder) {
    return {
      ...base,
      type: LibraryItemType.Folder,
      children: []
    }
  }

  if (item.type === LibraryItemType.Document) {
    return {
      ...base,
      type: LibraryItemType.Document,
      documentId: item.documentId ?? '',
      link: item.link ?? ''
    }
  }

  throw new Error('Unknown library item type')
}

/**
 * Converts a flat array of `LibraryItemRaw` elements into a tree structure made of `LibraryItem` values
 * @param items The flat array to convert
 * @param excludeItem An item to exclude from the tree (together with its children)
 * @returns The tree structure with multiple roots
 */
export const getLibraryTree = (
  items: LibraryItemRaw[],
  excludeItem?: LibraryItem
): LibraryItem[] => {
  const map = new Map<string, LibraryItem>()
  const roots: LibraryItem[] = []

  for (const item of items) {
    map.set(item.id, itemFromRaw(item))
  }

  for (const item of items) {
    if (item.id === excludeItem?.id) {
      continue
    }

    // The map.get() call is safe because we've just set the value
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const mappedItem = map.get(item.id)!

    if (item.parentId) {
      const parent = map.get(item.parentId)

      if (parent && parent.type === LibraryItemType.Folder) {
        parent.children.push(mappedItem)

        mappedItem.parent = parent
        mappedItem.path = [...parent.path, mappedItem.title]
      }
    } else {
      roots.push(mappedItem)
    }
  }

  return roots
}
