import type { OtherItem } from '~/pages/SearchWithFilters/types/other-filter'
import { OtherItemStatus } from '~/pages/SearchWithFilters/types/other-filter'

export type OtherItemsAction = {
  type: string
  value?: OtherItem
}

const resetKey = (items: OtherItem[], id?: string, status?: OtherItemStatus): OtherItem[] => {
  switch (status) {
    case OtherItemStatus.NEW: {
      return items.filter(i => i.id !== id)
    }

    default: {
      const newStatus =
        status === OtherItemStatus.APPLIED ? OtherItemStatus.DELETED : OtherItemStatus.APPLIED

      return items.map(i => {
        if (i.id === id) {
          return { ...i, status: newStatus }
        }

        return i
      })
    }
  }
}

const deleteApplied = (items: OtherItem[]): OtherItem[] => {
  const newItems: OtherItem[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.status === OtherItemStatus.APPLIED) {
      newItems.push({ ...item, status: OtherItemStatus.DELETED })
    } else {
      newItems.push({ ...item })
    }
  }

  return newItems
}

const clearModified = (items: OtherItem[]): OtherItem[] => {
  const newItems: OtherItem[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.status === OtherItemStatus.NEW) {
      continue
    }

    newItems.push({ ...item, status: OtherItemStatus.APPLIED })
  }

  return newItems
}

const setApplied = (items: OtherItem[]): OtherItem[] => {
  const newItems: OtherItem[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.status === OtherItemStatus.DELETED) {
      continue
    }

    newItems.push({ ...item, status: OtherItemStatus.APPLIED })
  }

  return newItems
}

const deleteItem = (items: OtherItem[], value?: OtherItem): OtherItem[] => {
  const id = value?.id

  const item = items.find(i => i.id === id)

  if (item === undefined || item.status === OtherItemStatus.DELETED) {
    return { ...items }
  }

  if (item.status === OtherItemStatus.APPLIED) {
    return items.map(i => {
      if (i.id === id) {
        return { ...i, status: OtherItemStatus.DELETED }
      }

      return i
    })
  }

  return items.filter(i => i.id !== id)
}

export const itemsReducer = (
  items: OtherItem[] | undefined,
  action: OtherItemsAction
): OtherItem[] | undefined => {
  switch (action.type) {
    case 'added': {
      if (action.value === undefined) {
        return items
      }

      if (items === undefined) {
        return [action.value]
      }

      return [...items, action.value]
    }

    case 'updated': {
      return items?.map(i => {
        if (i.id === action.value?.id) {
          return action.value
        }

        return { ...i }
      })
    }

    case 'deleted': {
      if (items === undefined) {
        return undefined
      }

      return deleteItem(items, action.value)
    }

    case 'set-applied': {
      if (items === undefined) {
        return undefined
      }

      return setApplied(items)
    }

    case 'clear-modified': {
      if (items === undefined) {
        return undefined
      }

      return clearModified(items)
    }

    case 'delete-applied': {
      if (items === undefined) {
        return undefined
      }

      return deleteApplied(items)
    }

    case 'reset-key': {
      if (items === undefined) {
        return undefined
      }

      return resetKey(items, action.value?.id, action.value?.status)
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
