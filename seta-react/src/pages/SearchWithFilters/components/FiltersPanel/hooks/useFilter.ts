import { useState, useReducer, useRef } from 'react'

import { parseQueryContract } from '~/pages/SearchWithFilters/custom/map-filters'
import type { QueryAggregationContract } from '~/pages/SearchWithFilters/types/contracts'
import {
  FilterStatus,
  FilterStatusInfo,
  ViewFilterInfo
} from '~/pages/SearchWithFilters/types/filter-info'
import type { RangeValue, SelectionKeys } from '~/pages/SearchWithFilters/types/filters'
import { TextChunkValues } from '~/pages/SearchWithFilters/types/filters'

import { itemsReducer } from '../reducers/items-reducer'
import { statusReducer } from '../reducers/status-reducer'
import { buildFilterInfo } from '../utils/buildFilterInfo'

const useFilter = (
  queryContract?: QueryAggregationContract | null,
  resourceSelectedKeys?: SelectionKeys | null,
  taxonomySelectedKeys?: SelectionKeys | null
) => {
  const { rangeVal, resources, taxonomies, data } = parseQueryContract(queryContract)

  const [prevContract, setPrevContract] = useState(queryContract)
  const [chunkText, setChunkText] = useState<TextChunkValues>(TextChunkValues.CHUNK_SEARCH)

  const [rangeValue, setRangeValue] = useState<RangeValue | undefined>(undefined)
  const [resourceNodes, setResourceNodes] = useState(resources)
  const [taxonomyNodes, setTaxonomyNodes] = useState(taxonomies)
  const filterData = useRef(data)

  const [rangeBoundaries, setRangeBoundaries] = useState({ min: rangeVal?.[0], max: rangeVal?.[1] })

  const filterStatusInfo = new FilterStatusInfo()

  filterStatusInfo.prevStatus = FilterStatus.UNKNOWN

  filterStatusInfo.appliedFilter = new ViewFilterInfo()

  filterStatusInfo.appliedFilter.chunkValue = TextChunkValues[chunkText]

  const [status, dispatchStatus] = useReducer(statusReducer, filterStatusInfo)
  const [otherItems, dispatchOtherItems] = useReducer(itemsReducer, undefined)

  //!Yes, it compares the pointers, not the content
  if (queryContract !== prevContract) {
    const setNewStatus = () => {
      const newStatus = new FilterStatusInfo()

      newStatus.status = FilterStatus.APPLIED
      newStatus.prevStatus = FilterStatus.APPLIED

      const newItems = itemsReducer(otherItems, { type: 'set-applied' })

      newStatus.appliedFilter = buildFilterInfo({
        chunkText,
        rangeValue,
        resourceSelectedKeys,
        taxonomySelectedKeys,
        otherItems: newItems,
        resources: filterData.current.sources,
        taxonomies: filterData.current.taxonomies
      })

      newStatus.currentFilter = newStatus.appliedFilter.copy()
      //!otherItems are ignore on currentFilter
      newStatus.currentFilter.otherItems = undefined

      dispatchStatus({ type: 'replace', value: newStatus })
    }

    setPrevContract(queryContract)

    setRangeBoundaries({ min: rangeVal?.[0], max: rangeVal?.[1] })

    setResourceNodes(resources)
    setTaxonomyNodes(taxonomies)

    dispatchOtherItems({ type: 'set-applied' })

    //!call this before setting current resourcesFlat & taxonomiesFlat
    setNewStatus()

    filterData.current = data
  }

  return {
    chunkText,
    setChunkText,
    rangeBoundaries,
    rangeValue,
    setRangeValue,
    resourceNodes,
    taxonomyNodes,
    status,
    dispatchStatus,
    otherItems,
    dispatchOtherItems,
    filterData
  }
}

export default useFilter
