/* eslint-disable max-params */
import { useState, useReducer } from 'react'

import { itemsReducer } from './items-reducer'
import { statusReducer } from './status-reducer'

import { parseQueryContract } from '../../custom/map-filters'
import type { QueryAggregationContract } from '../../types/contracts'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import {
  TextChunkValues,
  FilterStatusInfo,
  FilterStatus,
  ViewFilterInfo
} from '../../types/filters'
import type { OtherItem } from '../../types/other-filter'

const buildFilterInfo = (
  chunkText: TextChunkValues,
  enableDateFilter: boolean,
  rangeValue?: RangeValue,
  resourceSelectedKeys?: SelectionKeys | null,
  taxonomySelectedKeys?: SelectionKeys | null,
  otherItems?: OtherItem[]
): ViewFilterInfo => {
  const fi = new ViewFilterInfo()

  fi.chunkValue = TextChunkValues[chunkText]
  fi.rangeValueEnabled = enableDateFilter && !!rangeValue
  fi.rangeValue = enableDateFilter && !!rangeValue ? { ...rangeValue } : undefined

  if (resourceSelectedKeys) {
    fi.sourceValues = []

    for (const rKey in resourceSelectedKeys) {
      if (!resourceSelectedKeys[rKey].checked) {
        continue
      }

      fi.sourceValues.push({
        key: rKey,
        label: rKey,
        longLabel: rKey
      })
    }
  }

  if (taxonomySelectedKeys) {
    fi.taxonomyValues = []

    for (const tKey in taxonomySelectedKeys) {
      if (!taxonomySelectedKeys[tKey].checked) {
        continue
      }

      fi.taxonomyValues.push({
        key: tKey,
        label: tKey,
        longLabel: tKey
      })
    }
  }

  fi.otherItems = otherItems

  return fi
}

const useFilter = (
  queryContract?: QueryAggregationContract | null,
  resourceSelectedKeys?: SelectionKeys | null,
  taxonomySelectedKeys?: SelectionKeys | null
) => {
  const [prevContract, setPrevContract] = useState(queryContract)

  const { rangeVal, resources, taxonomies } = parseQueryContract(queryContract)
  const [chunkText, setChunkText] = useState<TextChunkValues>(TextChunkValues.CHUNK_SEARCH)

  const [rangeValue, setRangeValue] = useState(rangeVal)
  const [resourceNodes, setResourceNodes] = useState(resources)
  const [taxonomyNodes, setTaxonomyNodes] = useState(taxonomies)

  const [enableDateFilter, setEnableDateFilter] = useState(false)
  const [rangeBoundaries, setRangeBoundaries] = useState({ min: rangeVal?.[0], max: rangeVal?.[1] })

  const filterStatusInfo = new FilterStatusInfo()

  filterStatusInfo.prevStatus = FilterStatus.UNKNOWN

  filterStatusInfo.appliedFilter = new ViewFilterInfo()

  filterStatusInfo.appliedFilter.chunkValue = TextChunkValues[chunkText]

  const [status, dispatchStatus] = useReducer(statusReducer, filterStatusInfo)
  const [otherItems, dispatchOtherItems] = useReducer(itemsReducer, undefined)

  //!Yes, it compares the pointers, not the content
  if (queryContract !== prevContract) {
    console.log('useFilter', queryContract)

    setPrevContract(queryContract)

    if (!rangeVal) {
      setEnableDateFilter(false)
    }

    setRangeValue(rangeVal)
    setRangeBoundaries({ min: rangeVal?.[0], max: rangeVal?.[1] })

    setResourceNodes(resources)
    setTaxonomyNodes(taxonomies)
    dispatchOtherItems({ type: 'set-applied' })

    const newStatus = new FilterStatusInfo()

    newStatus.status = FilterStatus.APPLIED
    newStatus.prevStatus = FilterStatus.APPLIED

    const newItems = itemsReducer(otherItems, { type: 'set-applied' })

    newStatus.appliedFilter = buildFilterInfo(
      chunkText,
      enableDateFilter,
      rangeValue,
      resourceSelectedKeys,
      taxonomySelectedKeys,
      newItems
    )

    dispatchStatus({ type: 'replace', value: newStatus })
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
