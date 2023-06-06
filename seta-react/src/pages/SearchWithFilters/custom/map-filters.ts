import type { QueryAggregationContract, SourceInfo, Taxonomy, YearCount } from '../types/contracts'
import type { FilterData, FilterDatas } from '../types/filter-data'
import type { RangeValue } from '../types/filters'

type TreeNode = {
  key: string
  label: string
  children?: TreeNode[]
}

const mapYearsRangeToFilter = (value: YearCount[]): RangeValue => {
  const years = value.map(v => Number(v.year))

  return [Math.min(...years), Math.max(...years)]
}

const mapTaxonomyCategories = (
  array: FilterData[],
  parentId: string,
  value?: Taxonomy[]
): TreeNode[] | undefined => {
  if (!value?.length) {
    return undefined
  }

  const nodes: TreeNode[] = []

  value.forEach(c => {
    const key = `${parentId}:${c.name_in_path}`

    const node: TreeNode = {
      key: key,
      label: `${c.label ?? ''} (${c.doc_count})`
    }

    nodes.push(node)
    array.push({ key: key, label: c.label ?? '', category: 'taxonomy', count: c.doc_count })

    node.children = mapTaxonomyCategories(array, key, c.subcategories)
  })

  return nodes
}

const mapTaxonomyToFilter = (value: Taxonomy[]): { nodes: TreeNode[]; array: FilterData[] } => {
  const nodes: TreeNode[] = []
  const array: FilterData[] = []

  value.forEach(t => {
    const node: TreeNode = {
      key: t.name_in_path,
      label: `${t.label} (${t.doc_count})`
    }

    nodes.push(node)
    array.push({
      key: t.name_in_path,
      label: t.label ?? '',
      category: 'catalogue',
      count: t.doc_count
    })

    node.children = mapTaxonomyCategories(array, t.name_in_path, t.subcategories)
  })

  return { nodes, array }
}

const mapResourcesToFilter = (value: SourceInfo[]): { nodes: TreeNode[]; array: FilterData[] } => {
  const nodes: TreeNode[] = []
  const array: FilterData[] = []

  value.forEach(source => {
    const sourceNode: TreeNode = {
      key: `${source.key}`,
      label: `${source.key} (${source.doc_count})`
    }

    nodes.push(sourceNode)
    array.push({ key: source.key, label: source.key, category: 'source', count: source.doc_count })

    if (source.collections) {
      sourceNode.children = source.collections.map(collection => {
        const colNode: TreeNode = {
          key: `${source.key}:${collection.key}`,
          label: `${collection.key} (${collection.doc_count})`
        }

        array.push({
          key: colNode.key,
          label: collection.key,
          category: 'collection',
          count: collection.doc_count
        })

        if (collection.references) {
          colNode.children = collection.references.map(reference => {
            const refNode: TreeNode = {
              key: `${source.key}:${collection.key}:${reference.key}`,
              label: `${reference.key} (${reference.doc_count})`
            }

            array.push({
              key: refNode.key,
              label: reference.key,
              category: 'resource',
              count: reference.doc_count
            })

            return refNode
          })
        }

        return colNode
      })
    }
  })

  return { nodes, array }
}

export const parseQueryContract = (contract?: QueryAggregationContract | null) => {
  let rangeVal: RangeValue | undefined = undefined
  let resources: TreeNode[] | undefined = undefined
  let taxonomies: TreeNode[] | undefined = undefined
  const filtersData: FilterDatas = {}

  if (contract) {
    if (contract.date_year && contract.date_year.length) {
      rangeVal = mapYearsRangeToFilter(contract.date_year)

      filtersData.years = contract.date_year.map(y => {
        return { key: y.year, label: y.year, category: 'year', count: y.doc_count }
      })
    }

    if (contract.source_collection_reference?.sources) {
      const { nodes, array } = mapResourcesToFilter(contract.source_collection_reference.sources)

      resources = nodes
      filtersData.sources = array
    }

    if (contract.taxonomies !== undefined) {
      const { nodes, array } = mapTaxonomyToFilter(contract.taxonomies)

      taxonomies = nodes
      filtersData.taxonomies = array
    }
  }

  return { rangeVal, resources, taxonomies, data: filtersData }
}
