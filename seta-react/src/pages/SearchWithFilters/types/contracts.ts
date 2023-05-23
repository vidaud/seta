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

export type TaxonomyCategory = {
  code: string
  doc_count: number
  label: string
  longLabel?: string
  name_in_path: string
  subcategories?: TaxonomyCategory[]
}

export type Taxonomy = {
  doc_count: number
  name: string
  name_in_path: string
  subcategories?: TaxonomyCategory[]
}

export type QueryAggregationContract = {
  search_type?: string
  date_year?: YearCount[]
  source_collection_reference?: { sources: SourceInfo[] }
  taxonomy?: Taxonomy[]
}

export type AdvancedFiltersContract = {
  search_type: string
  date_range?: string[]
  source?: string[]
  collection?: string[]
  reference?: string[]
  taxonomy_path?: string[]
  other?: { name: string; value: string }[]
}

export type AdvancedFilterProps = {
  queryContract?: QueryAggregationContract | null
  onApplyFilter(value: AdvancedFiltersContract): void
  filtersDisabled?: boolean
}
