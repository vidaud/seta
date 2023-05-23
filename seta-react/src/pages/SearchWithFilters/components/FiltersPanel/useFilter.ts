import { useState, useReducer } from 'react'

import { itemsReducer } from './items-reducer'
import { statusReducer } from './status-reducer'

import { parseQueryContract } from '../../custom/map-filters'
import type { QueryAggregationContract } from '../../types/contracts'
import type { RangeValue } from '../../types/filters'
import {
  TextChunkValues,
  FilterStatusInfo,
  FilterStatus,
  ViewFilterInfo
} from '../../types/filters'

const useFilter = (queryContract?: QueryAggregationContract | null) => {
  const [prevContract, setPrevContract] = useState(queryContract)

  const { rangeVal, resources, taxonimies } = parseQueryContract(queryContract)
  const [chunkText, setChunkText] = useState<TextChunkValues>(TextChunkValues.CHUNK_SEARCH)

  const [rangeValue, setRangeValue] = useState<RangeValue>(rangeVal)
  const [resourceNodes, setResourceNodes] = useState(resources)
  const [taxonomyNodes, setTaxonomyNodes] = useState(taxonimies)

  const [enableDateFilter, setEnableDateFilter] = useState(false)
  const [rangeBoundaries, setRangeBoundaries] = useState({ min: rangeVal[0], max: rangeVal[1] })

  const filterStatusInfo = new FilterStatusInfo()

  filterStatusInfo.prevStatus = FilterStatus.UNKNOWN

  filterStatusInfo.appliedFilter = new ViewFilterInfo()

  filterStatusInfo.appliedFilter.chunkValue = TextChunkValues[chunkText]

  const [status, dispatchStatus] = useReducer(statusReducer, filterStatusInfo)
  const [otherItems, dispatchOtherItems] = useReducer(itemsReducer, undefined)

  //!Yes, it compares the pointers, not the content
  if (queryContract !== prevContract) {
    setPrevContract(queryContract)

    setRangeBoundaries({ min: rangeVal[0], max: rangeVal[1] })
    setRangeValue(rangeVal)
    setResourceNodes(resources)
    setTaxonomyNodes(taxonimies)

    dispatchStatus({ type: 'set-status', value: FilterStatus.APPLIED })
    dispatchOtherItems({ type: 'set-applied' })
  }

  return {
    chunkText,
    setChunkText,
    enableDateFilter,
    setEnableDateFilter,
    rangeBoundaries,
    rangeValue,
    setRangeValue,
    resourceNodes,
    taxonomyNodes,
    status,
    dispatchStatus,
    otherItems,
    dispatchOtherItems
  }
}

export default useFilter
