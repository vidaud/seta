export enum AggregationType {
  Source = 'source',
  DateYear = 'date_year',
  CollectionReference = 'source_collection_reference',
  TaxonomyName = 'taxonomy:taxonomyname'
}

type SimpleAggregation = {
  doc_count: number
  key: string
}

type CollectionReference = SimpleAggregation & {
  references: SimpleAggregation
}

type CollectionsAggregation = {
  sources: [
    SimpleAggregation & {
      collections: CollectionReference[]
    }
  ]
}

type Subcategory = {
  classifier: string
  code: string
  doc_count: number
  label: string
  longLabel: string
  name_in_path: string
  subcategories: Subcategory[]
}

type TaxonomyAggregation = {
  doc_count: number
  name: string
  name_in_path: string
  subcategories: Subcategory[]
}

export type Aggregations = {
  [AggregationType.Source]?: SimpleAggregation[]
  [AggregationType.DateYear]?: [{ doc_count: number; year: string }]
  [AggregationType.CollectionReference]?: CollectionsAggregation
  [AggregationType.TaxonomyName]?: TaxonomyAggregation[]
}
