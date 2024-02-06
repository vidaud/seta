import type { Label } from '~/types/search/annotations'

import type { AdvancedFiltersContract } from '../types/contracts'
import type { RangeValue, SelectionKeys } from '../types/filters'
import { TextChunkValues } from '../types/filters'
import type { OtherItem, OtherType } from '../types/other-filter'
import { OtherItemStatus } from '../types/other-filter'

const mapSearchTypeToQuery = (searchType: TextChunkValues): string => {
  return TextChunkValues[searchType]
}

const mapYearsRangeToQuery = (value: RangeValue): string[] => {
  //keep lower interval
  const gte = value[0]
  //!transform upper interval to 'lower than' (selected year + 1)
  const lt = value[1] + 1

  return [`gte:${gte}`, `lt:${lt}`]
}

const mapSelectedDataSources = (
  selectedResources: SelectionKeys
): { dsIds: string[]; cIds: string[]; rIds: string[] } => {
  const dsIds: string[] = []
  const cIds: string[] = []
  const rIds: string[] = []

  const parseId = (rKey: string): void => {
    const arr = rKey.split(':')

    switch (arr.length) {
      case 1: {
        //this is a data source id
        dsIds.push(arr[0])
        break
      }

      case 2: {
        //this is a collection id
        cIds.push(arr[1])
        break
      }

      case 3: {
        //this is a collection id
        rIds.push(arr[2])
        break
      }
    }
  }

  for (const rKey in selectedResources) {
    if (!selectedResources[rKey].checked) {
      continue
    }

    parseId(rKey)
  }

  return { dsIds, cIds, rIds }
}

type Args = {
  searchType: TextChunkValues
  yearsRange?: RangeValue
  selectedResources?: SelectionKeys | null
  selectedTaxonomies?: SelectionKeys | null
  selectedLabels?: Label[]
  otherItems?: OtherItem[]
}

export const buildFiltersContract = ({
  searchType,
  yearsRange,
  selectedResources,
  selectedTaxonomies,
  selectedLabels,
  otherItems
}: Args): AdvancedFiltersContract => {
  const contract: AdvancedFiltersContract = {
    search_type: mapSearchTypeToQuery(searchType)
  }

  if (yearsRange) {
    contract.date_range = mapYearsRangeToQuery(yearsRange)
  }

  if (selectedTaxonomies) {
    contract.taxonomy_path = []

    for (const tKey in selectedTaxonomies) {
      if (selectedTaxonomies[tKey].checked) {
        contract.taxonomy_path.push(tKey)
      }
    }
  }

  if (selectedLabels) {
    contract.annotation = selectedLabels.map(({ category, name }) => `${category}:${name}`)
  }

  if (selectedResources) {
    const { dsIds, cIds, rIds } = mapSelectedDataSources(selectedResources)

    if (dsIds.length > 0) {
      contract.source = [...new Set(dsIds)]
    }

    if (cIds.length > 0) {
      contract.collection = [...new Set(cIds)]
    }

    if (rIds.length > 0) {
      contract.reference = [...new Set(rIds)]
    }
  }

  if (otherItems) {
    const items = otherItems.filter(i => i.status !== OtherItemStatus.DELETED)

    if (items?.length) {
      contract.other = []

      items.forEach(i => {
        const ot: OtherType = {}

        ot[i.name] = i.value
        contract.other?.push(ot)
      })
    }
  }

  return contract
}
