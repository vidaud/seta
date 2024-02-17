import type { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { OtherItemsAction } from '~/pages/SearchWithFilters/components/FiltersPanel/reducers/items-reducer'
import { itemsReducer } from '~/pages/SearchWithFilters/components/FiltersPanel/reducers/items-reducer'
import { buildFiltersContract } from '~/pages/SearchWithFilters/custom/map-query'
import type { AdvancedFiltersContract } from '~/pages/SearchWithFilters/types/contracts'
import type { FilterDatas } from '~/pages/SearchWithFilters/types/filter-data'
import { FilterStatus } from '~/pages/SearchWithFilters/types/filter-info'
import { TextChunkValues } from '~/pages/SearchWithFilters/types/filters'
import type { RangeValue, SelectionKeys } from '~/pages/SearchWithFilters/types/filters'
import type { OtherItem } from '~/pages/SearchWithFilters/types/other-filter'

import type { Label } from '~/types/search/annotations'

type KeyLabel = {
  key: string
  label: string
}

type Args = {
  chunkText: TextChunkValues
  rangeValue?: RangeValue
  resourceSelectedKeys?: SelectionKeys | null
  taxonomySelectedKeys?: SelectionKeys | null
  selectedLabels?: Label[]
  otherItems?: OtherItem[]
  filterData: MutableRefObject<FilterDatas>

  setChunkText: Dispatch<SetStateAction<TextChunkValues>>
  setRangeValue: Dispatch<SetStateAction<RangeValue | undefined>>
  setResourceSelectedKeys: Dispatch<SetStateAction<SelectionKeys | null>>
  setTaxonomySelectedKeys: Dispatch<SetStateAction<SelectionKeys | null>>
  setSelectedLabels: Dispatch<SetStateAction<Label[]>>

  // TODO: Refactor to replace `any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatchStatus: Dispatch<any>
  dispatchOtherItems: Dispatch<OtherItemsAction>
  onApplyFilter: (value: AdvancedFiltersContract) => void
}

const useFiltersHandlers = ({
  chunkText,
  rangeValue,
  resourceSelectedKeys,
  taxonomySelectedKeys,
  selectedLabels,
  otherItems,
  filterData,
  setChunkText,
  setRangeValue,
  setResourceSelectedKeys,
  setTaxonomySelectedKeys,
  setSelectedLabels,
  dispatchStatus,
  dispatchOtherItems,
  onApplyFilter
}: Args) => {
  const handleApplyFilters = () => {
    const contract = buildFiltersContract({
      searchType: chunkText,
      yearsRange: rangeValue,
      selectedResources: resourceSelectedKeys,
      selectedTaxonomies: taxonomySelectedKeys,
      selectedLabels,
      otherItems
    })

    dispatchStatus({ type: 'set_status', value: FilterStatus.PROCESSING })

    onApplyFilter(contract)
  }

  const handleTextChunkChange = (value: TextChunkValues) => {
    dispatchStatus({ type: 'chunk_changed', value: TextChunkValues[value] })

    setChunkText(value)
  }

  const handleRangeChange = (value: RangeValue) => {
    dispatchStatus({ type: 'range_changed', value: value })

    setRangeValue(value)
  }

  const handleSourceSelectionChange = (value: SelectionKeys | null) => {
    let checkedKeys: KeyLabel[] | null = null

    if (value) {
      checkedKeys = []

      for (const key in value) {
        if (value[key].checked) {
          const kl = filterData.current?.sources?.find(t => t.key === key)
          const lbl = kl ? kl.label : key

          checkedKeys.push({ key: key, label: lbl })
        }
      }
    }

    dispatchStatus({
      type: 'source_changed',
      value: checkedKeys
    })

    setResourceSelectedKeys(value)
  }

  const handleTaxonomySelectionChange = (value: SelectionKeys | null) => {
    let checkedKeys: KeyLabel[] | null = null

    if (value) {
      checkedKeys = []

      for (const key in value) {
        if (value[key].checked) {
          const kl = filterData.current?.taxonomies?.find(t => t.key === key)
          const lbl = kl ? kl.label : key

          checkedKeys.push({ key: key, label: lbl })
        }
      }
    }

    dispatchStatus({
      type: 'taxonomy_changed',
      value: checkedKeys
    })

    setTaxonomySelectedKeys(value)
  }

  const handleSelectedLabelsChange = (value: Label[]) => {
    dispatchStatus({
      type: 'labels_changed',
      value: value
    })

    setSelectedLabels(value)
  }

  const handleItemChange = (type: string, item: OtherItem | undefined) => {
    dispatchOtherItems({ type, value: item })

    //get items for the next render
    const nextItems = itemsReducer(otherItems, { type, value: item })

    dispatchStatus({
      type: 'other_changed',
      value: nextItems
    })
  }

  return {
    handleApplyFilters,
    handleTextChunkChange,
    handleRangeChange,
    handleSourceSelectionChange,
    handleTaxonomySelectionChange,
    handleSelectedLabelsChange,
    handleItemChange
  }
}

export default useFiltersHandlers
