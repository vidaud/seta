import type { AdvancedFiltersContract } from '../types/contracts'
import type { RangeValue, SelectionKeys } from '../types/filters'
import { TextChunkValues } from '../types/filters'

const mapSearchTypeToQuery = (searchType: TextChunkValues): string => {
  return TextChunkValues[searchType]
}

const mapYearsRangeToQuery = (value: RangeValue): string[] => {
  return [`gt:${value[0].toString()}`, `lt:${value[1].toString()}`]
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

export const buildFiltersContract = (
  searchType: TextChunkValues,
  yearsRange?: RangeValue,
  selectedResources?: SelectionKeys | null,
  selectedTaxonomies?: SelectionKeys | null
): AdvancedFiltersContract => {
  const contract: AdvancedFiltersContract = {
    search_type: mapSearchTypeToQuery(searchType)
  }

  if (yearsRange) {
    contract.date_range = mapYearsRangeToQuery(yearsRange)
  }

  if (selectedTaxonomies) {
    contract.taxonomy_paths = []

    for (const tKey in selectedTaxonomies) {
      if (selectedTaxonomies[tKey].checked) {
        contract.taxonomy_paths.push(tKey)
      }
    }
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

  return contract
}
