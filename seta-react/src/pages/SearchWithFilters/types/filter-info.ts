import type { RangeValue } from './filters'
import type { OtherItem } from './other-filter'

export enum FilterStatus {
  PROCESSING = 'processing',
  APPLIED = 'applied',
  MODIFIED = 'modified',
  UNKNOWN = 'unknown'
}

export type NodeInfo = {
  key: string
  label: string
  longLabel: string
}

export class ViewFilterInfo {
  chunkValue?: string
  rangeValueEnabled = false
  rangeValue?: RangeValue
  sourceValues?: NodeInfo[] | null
  taxonomyValues?: NodeInfo[] | null
  otherItems?: OtherItem[]

  public copy(): ViewFilterInfo {
    const cpy = new ViewFilterInfo()

    cpy.chunkValue = this.chunkValue
    cpy.rangeValueEnabled = this.rangeValueEnabled
    cpy.rangeValue = this.rangeValue

    cpy.sourceValues = this.sourceValues?.map(s => {
      return { ...s }
    })

    cpy.taxonomyValues = this.taxonomyValues?.map(t => {
      return { ...t }
    })

    cpy.otherItems = this.otherItems?.map(i => {
      return { ...i }
    })

    return cpy
  }
}

export class FilterStatusInfo {
  chunkModified?: number
  rangeModified?: number
  sourceModified?: number
  taxonomyModified?: number
  otherModified?: number

  appliedFilter?: ViewFilterInfo
  currentFilter?: ViewFilterInfo

  prevStatus: FilterStatus = FilterStatus.UNKNOWN
  status: FilterStatus

  public modified(): number | null {
    return (
      (this.chunkModified ?? 0) +
      (this.rangeModified ?? 0) +
      (this.sourceModified ?? 0) +
      (this.taxonomyModified ?? 0) +
      (this.otherModified ?? 0)
    )
  }

  public applied(): number | null {
    if (!this.appliedFilter) {
      return null
    }

    let applied = 0

    if (this.appliedFilter.chunkValue) {
      applied++
    }

    if (this.appliedFilter.rangeValueEnabled && this.appliedFilter.rangeValue) {
      applied++
    }

    if (this.appliedFilter.sourceValues?.length) {
      applied += this.appliedFilter.sourceValues.length
    }

    if (this.appliedFilter.taxonomyValues?.length) {
      applied += this.appliedFilter.taxonomyValues.length
    }

    if (this.appliedFilter.otherItems?.length) {
      applied += this.appliedFilter.otherItems.length
    }

    return applied
  }

  public copy(): FilterStatusInfo {
    const cpy = new FilterStatusInfo()

    cpy.chunkModified = this.chunkModified
    cpy.rangeModified = this.rangeModified
    cpy.sourceModified = this.sourceModified
    cpy.taxonomyModified = this.taxonomyModified
    cpy.otherModified = this.otherModified

    cpy.appliedFilter = this.appliedFilter?.copy()
    cpy.currentFilter = this.currentFilter?.copy()

    cpy.prevStatus = this.prevStatus
    cpy.status = this.status

    return cpy
  }
}
