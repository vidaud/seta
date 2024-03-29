import type { Annotation } from '~/types/search/annotations'

export type Taxonomy = {
  classifier: string
  code: string
  label: string
  longLabel: string
  name_in_path: string
  validated: 'true' | 'false'
  version: string
  subcategories: Taxonomy[]
}

export type Other = Record<string, unknown> & {
  annotation_position?: Annotation[]
}

export type Document = {
  _id: string
  abstract: string
  author: string[] | null
  chunk_number: number
  chunk_text: string | null
  collection: string | null
  concordance: [string[]] | null
  date: string
  document_id: string
  id: string
  id_alias: string | null
  in_force: string | null
  keywords: { keyword: string; score: number }[] | null
  language: string
  link_origin: string | null
  other: Other | null
  reference: string | null
  score: number
  source: string
  taxonomy: Taxonomy[] | null
  title: string
}

export type Chunk = Document & {
  link_alias: string | null
  link_related: string | null
  link_reference: string | null
  mime_type: string | null
  sbert_embedding: number[]
}
