/* eslint-disable complexity */

import type { FilterStatusInfo } from '~/pages/SearchWithFilters/types/filter-info'
import type {
  ClearAction,
  RangeValue,
  SelectionKeys
} from '~/pages/SearchWithFilters/types/filters'
import { ClearCategory, ClearType, TextChunkValues } from '~/pages/SearchWithFilters/types/filters'
import type { OtherItem } from '~/pages/SearchWithFilters/types/other-filter'
import { OtherItemStatus } from '~/pages/SearchWithFilters/types/other-filter'

import type { Label } from '~/types/filters/label'

import { itemsReducer } from '../reducers/items-reducer'

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
  handleSelectedLabelsChange?(value: Label[]): void
  handleItemChange?(type: string, item: OtherItem | undefined): void
  handleRangeChange?(value: RangeValue | null): void
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
  handleSourceSelectionChange,
  handleTaxonomySelectionChange,
  handleSelectedLabelsChange,
  handleItemChange,
  handleRangeChange
}: Props) => {
  const clearAll = () => {
    //reset chunk text
    handleTextChunkChange?.(TextChunkValues.CHUNK_SEARCH)
    //reset date filter
    handleRangeChange?.(null)
    //reset resources
    handleSourceSelectionChange?.(null)
    //reset taxonomies
    handleTaxonomySelectionChange?.(null)

    //reset labels
    handleSelectedLabelsChange?.([])

    //reset other
    otherItems
      ?.filter(i => i.status !== OtherItemStatus.DELETED)
      .forEach(item => {
        handleItemChange?.('deleted', item)
      })
  }

  const clearModifiedDate = (): void => {
    if (status.appliedFilter?.rangeValue) {
      handleRangeChange?.(status.appliedFilter?.rangeValue)
    } else {
      handleRangeChange?.(null)
    }
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

  const clearModifiedLabels = (): void => {
    if (!status.appliedFilter?.labels) {
      handleSelectedLabelsChange?.([])

      return
    }

    handleSelectedLabelsChange?.(status.appliedFilter?.labels)
  }

  const clearAppliedLabels = (): void => {
    if (!status.appliedFilter?.labels || !status.appliedFilter?.labels?.length) {
      return
    }

    const newSelectedLabels: Label[] = []

    for (const label of status.appliedFilter?.labels) {
      newSelectedLabels.push({ ...label })
    }

    handleSelectedLabelsChange?.(newSelectedLabels)
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
    switch (action.type) {
      case ClearType.ALL: {
        clearAll()
        break
      }

      case ClearType.ALL_MODIFIED: {
        if (status.appliedFilter?.chunkValue) {
          handleTextChunkChange?.(TextChunkValues[status.appliedFilter?.chunkValue])
        }

        clearModifiedDate()

        clearModifiedSources()
        clearModifiedTaxonomies()
        clearModifiedLabels()

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

          case ClearCategory.LABELS:
            clearAppliedLabels()
            break

          case ClearCategory.OTHER:
            clearOther('delete-applied')
            break

          case ClearCategory.DATE:
            handleRangeChange?.(null)
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

          case ClearCategory.LABELS:
            clearModifiedLabels()
            break

          case ClearCategory.OTHER:
            clearOther('clear-modified')
            break

          case ClearCategory.DATE:
            clearModifiedDate()
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
