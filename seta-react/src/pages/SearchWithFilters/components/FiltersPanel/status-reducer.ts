/* eslint-disable complexity */
/* eslint-disable max-statements */

import keysDiff from '../../custom/array_diffs'
import { FilterStatus } from '../../types/filters'
import type { FilterStatusInfo, RangeValue } from '../../types/filters'

const compareRanges = (range1: RangeValue, range2?: RangeValue | null): boolean => {
  if (range2 === undefined || range2 === null) {
    return false
  }

  return range1[0] === range2[0] && range1[1] === range2[1]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const statusReducer = (status: FilterStatusInfo, action: any): FilterStatusInfo => {
  const info = status.copy()

  switch (action.type) {
    case 'replace': {
      return action.value
    }

    case 'chunk_changed': {
      if (action.value !== status.appliedFilter?.chunkValue) {
        info.chunkModified = 1
        info.status = FilterStatus.MODIFIED
      } else {
        info.chunkModified = 0
      }

      break
    }

    case 'enable_range': {
      if (status.appliedFilter?.rangeValueEnabled !== action.value) {
        info.rangeModified = 1
        info.status = FilterStatus.MODIFIED
      } else {
        info.rangeModified = 0
      }

      break
    }

    case 'range_changed': {
      if (compareRanges(action.value, status.appliedFilter?.rangeValue)) {
        info.rangeModified = 0
      } else {
        info.rangeModified = 1
        info.status = FilterStatus.MODIFIED
      }

      break
    }

    case 'source_changed': {
      const keys = status.appliedFilter?.sourceValues?.map(s => s.key)
      const { removed, added } = keysDiff(keys, action.value)

      info.sourceModified = removed.length + added.length

      if (info.sourceModified > 0) {
        info.status = FilterStatus.MODIFIED
      }

      break
    }

    case 'taxonomy_changed': {
      const keys = status.appliedFilter?.taxonomyValues?.map(s => s.key)
      const { removed, added } = keysDiff(keys, action.value)

      info.taxonomyModified = removed.length + added.length

      if (info.taxonomyModified > 0) {
        info.status = FilterStatus.MODIFIED
      }

      break
    }

    case 'set_status': {
      info.status = action.value

      return info
    }
  }

  if (info.modified() === 0) {
    info.status = status.prevStatus
  }

  return info
}
