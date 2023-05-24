/* eslint-disable complexity */
import type { OtherItem } from '../../types/other-filter'
import { OtherItemStatus } from '../../types/other-filter'

type Action = {
  type: string
  value?: OtherItem
}

export const itemsReducer = (
  items: OtherItem[] | undefined,
  action: Action
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
      if (items === undefined) {
        return undefined
      }

      return items.map(i => {
        if (i.id === action.value?.id) {
          return action.value
        }

        return i
      })
    }

    case 'deleted': {
      if (items === undefined) {
        return undefined
      }

      const id = action.value?.id

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

    case 'set-applied': {
      if (items === undefined) {
        return undefined
      }

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

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
