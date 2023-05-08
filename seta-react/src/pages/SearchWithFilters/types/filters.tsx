export enum TextChunkValues {
  CHUNK_SEARCH = 'CHUNK_SEARCH',
  DOCUMENT_SEARCH = 'DOCUMENT_SEARCH',
  ALL_CHUNKS_SEARCH = 'ALL_CHUNKS_SEARCH'
}

export type RangeValue = [number, number]

type SelectionKeyType = {
  checked?: boolean
  partialChecked?: boolean
}

export type SelectionKeys = {
  [key: string]: SelectionKeyType
}

export enum FilterStatus {
  PROCESSING = 'applying',
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
  rangeValueEnabled: boolean
  rangeValue?: RangeValue
  sourceValues?: NodeInfo[] | null
  taxonomyValues?: NodeInfo[] | null

  public copy(): ViewFilterInfo {
    const cpy = new ViewFilterInfo()

    cpy.chunkValue = this.chunkValue
    cpy.rangeValueEnabled = this.rangeValueEnabled
    cpy.rangeValue = this.rangeValue
    cpy.sourceValues = this.sourceValues?.map(s => {
      return { ...s }
    })

    return cpy
  }
}

export class FilterStatusInfo {
  chunkModified?: number
  rangeModified?: number
  sourceModified?: number
  taxonomyModified?: number

  appliedFilter?: ViewFilterInfo

  prevStatus: FilterStatus = FilterStatus.UNKNOWN
  status: FilterStatus

  public modified(): number | null {
    return (
      (this.chunkModified ?? 0) +
      (this.rangeModified ?? 0) +
      (this.sourceModified ?? 0) +
      (this.taxonomyModified ?? 0)
    )
  }

  public copy(): FilterStatusInfo {
    const cpy = new FilterStatusInfo()

    cpy.chunkModified = this.chunkModified
    cpy.rangeModified = this.rangeModified
    cpy.sourceModified = this.sourceModified
    cpy.taxonomyModified = this.taxonomyModified

    cpy.appliedFilter = this.appliedFilter?.copy()

    cpy.prevStatus = this.prevStatus
    cpy.status = this.status

    return cpy
  }
}
