import type { OtherType } from '~/pages/SearchWithFilters/types/other-filter'

import type { AggregationType, Aggregations } from '~/types/search/aggregations'

export type DocumentsPayload = {
  term?: string
  n_docs?: number
  from_doc?: number
  search_type?: string
  source?: string[]
  collection?: string[]
  subject?: string[]
  reference?: string[]
  in_force?: string
  sort?: string[]
  semantic_sort_id?: string
  semantic_sort_id_list?: string[]
  author?: string[]
  date_range?: string[]
  aggs?: AggregationType[]
  taxonomy_path?: string[]
  other?: OtherType[]
}

export type DocumentsResponse = {
  total_docs: number
  documents: Document[]
  aggregations?: Aggregations
}
