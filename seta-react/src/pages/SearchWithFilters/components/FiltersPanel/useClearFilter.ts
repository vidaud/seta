/* eslint-disable complexity */
import { itemsReducer } from './items-reducer'

import type { FilterStatusInfo } from '../../types/filter-info'
import type { ClearAction, RangeValue, SelectionKeys } from '../../types/filters'
import { ClearCategory, ClearType, TextChunkValues } from '../../types/filters'
import type { OtherItem } from '../../types/other-filter'
import { OtherItemStatus } from '../../types/other-filter'

type Props = {
  status: FilterStatusInfo
  otherItems?: OtherItem[]
  resourceSelectedKeys?: SelectionKeys | null
  taxonomySelectedKeys?: SelectionKeys | null
  dispatchStatus?(value)
  dispatchOtherItems?(value)
  handleTextChunkChange?(value: TextChunkValues): void
  handleEnableDateChanged?(value: boolean): void
  handleSourceSelectionChange?(value: SelectionKeys | null): void
  handleTaxonomySelectionChange?(value: SelectionKeys | null): void
  handleItemChange?(type, item): void
  handleRangeChange?(value: RangeValue): void
}

// eslint-disable-next-line max-lines-per-function
const useClearFilter = ({
  status,
  otherItems,
  resourceSelectedKeys,
  taxonomySelectedKeys,
  dispatchStatus,
  dispatchOtherItems,
  handleTextChunkChange,
  handleEnableDateChanged,
  handleSourceSelectionChange,
  handleTaxonomySelectionChange,
  handleItemChange,
  handleRangeChange
}: Props) => {
  const clearAll = () => {
    //reset chunk text
    handleTextChunkChange?.(TextChunkValues.CHUNK_SEARCH)
    //disable date filter
    handleEnableDateChanged?.(false)
    //reset resources
    handleSourceSelectionChange?.(null)
    //reset taxonomies
    handleTaxonomySelectionChange?.(null)
    //reset other
    otherItems
      ?.filter(i => i.status !== OtherItemStatus.DELETED)
      .forEach(item => {
        handleItemChange?.('deleted', item)
      })
  }

  const clearModifiedSources = (): void => {
    if (!status.appliedFilter?.sourceValues) {
      handleSourceSelectionChange?.(null)

      return
    }

    const selectionKeys: SelectionKeys = {}

    status.appliedFilter?.sourceValues.forEach(s => {
      selectionKeys[s.key] = { checked: true }
    })

    handleSourceSelectionChange?.(selectionKeys)
  }

  const clearAppliedSources = (): void => {
    if (!status.appliedFilter?.sourceValues || !resourceSelectedKeys) {
      return
    }

    const selectionKeys: SelectionKeys = {}

    for (const key in resourceSelectedKeys) {
      if (status.appliedFilter?.sourceValues.findIndex(s => s.key === key) === -1) {
        selectionKeys[key] = { ...resourceSelectedKeys[key] }
      }
    }

    handleSourceSelectionChange?.(selectionKeys)
  }

  const toggleResourceKey = (cKey: string | undefined): void => {
    if (!cKey) {
      return
    }

    const selectionKeys: SelectionKeys = {}
    let found = false

    if (resourceSelectedKeys) {
      for (const key in resourceSelectedKeys) {
        if (key !== cKey) {
          selectionKeys[key] = { ...resourceSelectedKeys[key] }
        } else {
          found = true
        }
      }
    }

    //if it wasn't in the selected list, than add it
    if (!found) {
      selectionKeys[cKey] = { checked: true }
    }

    handleSourceSelectionChange?.(selectionKeys)
  }

  const clearModifiedTaxonomies = (): void => {
    if (!status.appliedFilter?.taxonomyValues) {
      handleTaxonomySelectionChange?.(null)

      return
    }

    const selectionKeys: SelectionKeys = {}

    status.appliedFilter?.taxonomyValues.forEach(s => {
      selectionKeys[s.key] = { checked: true }
    })

    handleTaxonomySelectionChange?.(selectionKeys)
  }

  const clearAppliedTaxonomies = (): void => {
    if (!status.appliedFilter?.taxonomyValues || !taxonomySelectedKeys) {
      return
    }

    const selectionKeys: SelectionKeys = {}

    for (const key in resourceSelectedKeys) {
      if (status.appliedFilter?.taxonomyValues.findIndex(s => s.key === key) === -1) {
        selectionKeys[key] = { ...taxonomySelectedKeys[key] }
      }
    }

    handleTaxonomySelectionChange?.(selectionKeys)
  }

  const toggleTaxonomyKey = (cKey: string | undefined): void => {
    if (!cKey) {
      return
    }

    const selectionKeys: SelectionKeys = {}
    let found = false

    if (taxonomySelectedKeys) {
      for (const key in taxonomySelectedKeys) {
        if (key !== cKey) {
          selectionKeys[key] = { ...taxonomySelectedKeys[key] }
        } else {
          found = true
        }
      }
    }

    //if it wasn't in the selected list, than add it
    if (!found) {
      selectionKeys[cKey] = { checked: true }
    }

    handleTaxonomySelectionChange?.(selectionKeys)
  }

  const clearOther = (type: string) => {
    dispatchOtherItems?.({ type: type })
    //get items for the next render
    const nextItems = itemsReducer(otherItems, { type: type })

    dispatchStatus?.({
      type: 'other_changed',
      value: nextItems
    })
  }

  const clearOtherKey = (key: string | undefined) => {
    if (!key || !otherItems?.length) {
      return
    }

    const action = { type: 'reset-key', value: otherItems.find(i => i.id === key) }

    if (!action.value) {
      return
    }

    dispatchOtherItems?.(action)
    //get items for the next render
    const nextItems = itemsReducer(otherItems, action)

    dispatchStatus?.({
      type: 'other_changed',
      value: nextItems
    })
  }

  const handleClearFilters = (action: ClearAction) => {
    console.log('handleClearFilters', action)

    switch (action.type) {
      case ClearType.ALL: {
        clearAll()
        break
      }

      case ClearType.ALL_MODIFIED: {
        if (status.appliedFilter?.chunkValue) {
          handleTextChunkChange?.(TextChunkValues[status.appliedFilter?.chunkValue])
        }

        if (status.appliedFilter?.rangeValueEnabled !== undefined) {
          handleEnableDateChanged?.(status.appliedFilter?.rangeValueEnabled)
        }

        if (status.appliedFilter?.rangeValue) {
          handleRangeChange?.(status.appliedFilter?.rangeValue)
        }

        clearModifiedSources()
        clearModifiedTaxonomies()

        clearOther('clear-modified')

        break
      }

      case ClearType.ALL_APPLIED_IN_CATEGORY: {
        switch (action.value?.category) {
          case ClearCategory.SOURCE:
            clearAppliedSources()
            break

          case ClearCategory.TAXONOMY:
            clearAppliedTaxonomies()
            break

          case ClearCategory.OTHER:
            clearOther('delete-applied')
            break
        }

        break
      }

      case ClearType.ALL_MODIFIED_IN_CATEGORY: {
        switch (action.value?.category) {
          case ClearCategory.SOURCE:
            clearModifiedSources()
            break

          case ClearCategory.TAXONOMY:
            clearModifiedTaxonomies()
            break

          case ClearCategory.OTHER:
            clearOther('clear-modified')
            break
        }

        break
      }

      case ClearType.KEY: {
        switch (action.value?.category) {
          case ClearCategory.SOURCE:
            toggleResourceKey(action.value.key)
            break

          case ClearCategory.TAXONOMY:
            toggleTaxonomyKey(action.value.key)
            break

          case ClearCategory.OTHER:
            clearOtherKey(action.value.key)
            break
        }

        break
      }

      default: {
        throw Error('Unknown action: ' + action.type)
      }
    }
  }

  return { handleClearFilters }
}

export default useClearFilter
