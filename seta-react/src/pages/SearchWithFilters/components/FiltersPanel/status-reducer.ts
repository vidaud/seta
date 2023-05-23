/* eslint-disable complexity */

import keysDiff from '../../custom/array-diffs'
import { FilterStatus } from '../../types/filters'
import type { FilterStatusInfo, RangeValue } from '../../types/filters'
import { OtherItemStatus } from '../../types/other-filter'

const compareRanges = (range1: RangeValue, range2?: RangeValue | null): boolean => {
  if (range2 === undefined || range2 === null) {
    return false
  }

  return range1[0] === range2[0] && range1[1] === range2[1]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const statusReducer = (status: FilterStatusInfo, action: any): FilterStatusInfo => {
  if (action.type === 'replace') {
    return action.value
  }

  const info = status.copy()

  switch (action.type) {
    case 'chunk_changed': {
      info.chunkModified = action.value === status.appliedFilter?.chunkValue ? 0 : 1

      break
    }

    case 'enable_range': {
      info.rangeModified = status.appliedFilter?.rangeValueEnabled === action.value ? 0 : 1

      break
    }

    case 'range_changed': {
      info.rangeModified = compareRanges(action.value, status.appliedFilter?.rangeValue) ? 0 : 1

      break
    }

    case 'source_changed': {
      const keys = status.appliedFilter?.sourceValues?.map(s => s.key)
      const { removed, added } = keysDiff(keys, action.value)

      info.sourceModified = removed.length + added.length

      break
    }

    case 'taxonomy_changed': {
      const keys = status.appliedFilter?.taxonomyValues?.map(s => s.key)
      const { removed, added } = keysDiff(keys, action.value)

      info.taxonomyModified = removed.length + added.length

      break
    }

    case 'other_changed': {
      if (info.appliedFilter) {
        info.appliedFilter.otherItems = action.value
      }

      info.otherModified = action.value?.filter(i => i.status !== OtherItemStatus.APPLIED)?.length

      break
    }

    case 'set_status': {
      info.status = action.value

      return info
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }

  if (info.modified() === 0) {
    info.status = status.prevStatus
  } else {
    info.status = FilterStatus.MODIFIED
  }

  return info
}
