import type { ClassNameProp } from '~/types/children-props'

import type { FilterStatus } from './filter-info'
import type { OtherType } from './other-filter'

export type YearCount = {
  year: string
  doc_count: number
}

export type ReferenceInfo = {
  key: string
  doc_count: number
}

export type CollectionInfo = ReferenceInfo & {
  references?: ReferenceInfo[]
}

export type SourceInfo = ReferenceInfo & {
  collections?: CollectionInfo[]
}

export type Taxonomy = {
  doc_count?: number
  classifier?: string
  code?: string
  label?: string
  longLabel?: string
  name_in_path: string
  validated?: string
  version?: string
  subcategories?: Taxonomy[]
}

export type QueryAggregationContract = {
  search_type?: string
  date_year?: YearCount[]
  source_collection_reference?: { sources: SourceInfo[] }
  taxonomies?: Taxonomy[]
}

export type AdvancedFiltersContract = {
  search_type: string
  date_range?: string[]
  source?: string[]
  collection?: string[]
  reference?: string[]
  taxonomy_path?: string[]
  annotation?: string[]
  other?: OtherType[]
}

export type AdvancedFilterProps = {
  queryContract?: QueryAggregationContract | null
  onApplyFilter(value: AdvancedFiltersContract): void
  onStatusChange?(status: FilterStatus): void
  filtersDisabled?: boolean
} & ClassNameProp
