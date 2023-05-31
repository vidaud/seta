export type FilterData = {
  key: string
  label: string
  count?: number
  category?: string
}

export type FilterDatas = {
  years?: FilterData[]
  sources?: FilterData[]
  taxonomies?: FilterData[]
}
