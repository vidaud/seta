/* eslint-disable complexity */
import keysDiff from '~/pages/SearchWithFilters/custom/array-diffs'
import type { FilterStatusInfo } from '~/pages/SearchWithFilters/types/filter-info'
import { ViewFilterInfo, FilterStatus } from '~/pages/SearchWithFilters/types/filter-info'
import type { RangeValue } from '~/pages/SearchWithFilters/types/filters'
import { OtherItemStatus } from '~/pages/SearchWithFilters/types/other-filter'

const compareRanges = (range1?: RangeValue, range2?: RangeValue | null): boolean => {
  //both undefined or null
  if ((range1 === undefined || range1 === null) && (range2 === undefined || range2 === null)) {
    return true
  }

  //one of them undefined or null
  if (range1 === undefined || range1 === null || range2 === undefined || range2 === null) {
    return false
  }

  return range1[0] === range2[0] && range1[1] === range2[1]
}

const sourceChanged = (info: FilterStatusInfo, values) => {
  const keys = info.appliedFilter?.sourceValues?.map(s => s.key)
  const valueKeys = values?.map(v => v.key)

  const { removed, added } = keysDiff(keys, valueKeys)

  info.sourceModified = removed.length + added.length

  if (!info.currentFilter) {
    info.currentFilter = new ViewFilterInfo()
  }

  if (!values?.length) {
    info.currentFilter.sourceValues = undefined
  } else {
    info.currentFilter.sourceValues = values?.map(i => {
      return {
        key: i.key,
        label: i.label,
        longLabel: i.label
      }
    })
  }
}

const taxonomyChanged = (info: FilterStatusInfo, values) => {
  const keys = info.appliedFilter?.taxonomyValues?.map(s => s.key)
  const valueKeys = values?.map(v => v.key)

  const { removed, added } = keysDiff(keys, valueKeys)

  info.taxonomyModified = removed.length + added.length

  if (!info.currentFilter) {
    info.currentFilter = new ViewFilterInfo()
  }

  if (!values?.length) {
    info.currentFilter.taxonomyValues = undefined
  } else {
    info.currentFilter.taxonomyValues = values?.map(i => {
      return {
        key: i.key,
        label: i.label,
        longLabel: i.label
      }
    })
  }
}

const labelsChanged = (info: FilterStatusInfo, values) => {
  const keys = info.appliedFilter?.labels?.map(s => s.id)
  const valueKeys = values?.map(v => v.id)

  const { removed, added } = keysDiff(keys, valueKeys)

  info.labelsModified = removed.length + added.length

  if (!info.currentFilter) {
    info.currentFilter = new ViewFilterInfo()
  }

  if (!values?.length) {
    info.currentFilter.labels = undefined
  } else {
    info.currentFilter.labels = values
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const statusReducer = (status: FilterStatusInfo, action: any): FilterStatusInfo => {
  if (action.type === 'replace') {
    return action.value
  }

  const info = status.copy()

  if (!info.currentFilter) {
    info.currentFilter = new ViewFilterInfo()
  }

  switch (action.type) {
    case 'chunk_changed': {
      info.chunkModified = action.value === status.appliedFilter?.chunkValue ? 0 : 1
      info.currentFilter.chunkValue = action.value

      break
    }

    case 'range_changed': {
      info.rangeModified = compareRanges(action.value, status.appliedFilter?.rangeValue) ? 0 : 1
      info.currentFilter.rangeValue = action.value

      break
    }

    case 'source_changed': {
      sourceChanged(info, action.value)

      break
    }

    case 'taxonomy_changed': {
      taxonomyChanged(info, action.value)

      break
    }

    case 'labels_changed': {
      labelsChanged(info, action.value)

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
