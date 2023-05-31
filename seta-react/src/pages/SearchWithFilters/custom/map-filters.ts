import type { QueryAggregationContract, SourceInfo, Taxonomy, YearCount } from '../types/contracts'
import type { RangeValue } from '../types/filters'

type KeyLabel = {
  key: string
  label: string
}

type TreeNode = KeyLabel & {
  children?: TreeNode[]
}

const mapYearsRangeToFilter = (value: YearCount[]): RangeValue => {
  const years = value.map(v => Number(v.year))

  return [Math.min(...years), Math.max(...years)]
}

const mapTaxonomyCategories = (
  array: KeyLabel[],
  parentId: string,
  parentLabel?: string,
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

    array.push({ key: key, label: c.label ?? '' })
    nodes.push(node)

    node.children = mapTaxonomyCategories(array, key, c.label, c.subcategories)
  })

  return nodes
}

const mapTaxonomyToFilter = (value: Taxonomy[]): { nodes: TreeNode[]; array: KeyLabel[] } => {
  const nodes: TreeNode[] = []
  const array: KeyLabel[] = []

  value.forEach(t => {
    const node: TreeNode = {
      key: t.name_in_path,
      label: `${t.label} (${t.doc_count})`
    }

    nodes.push(node)
    array.push({ key: t.name_in_path, label: t.label ?? '' })

    node.children = mapTaxonomyCategories(array, t.name_in_path, t.label, t.subcategories)
  })

  return { nodes, array }
}

const mapResourcesToFilter = (value: SourceInfo[]): { nodes: TreeNode[]; array: KeyLabel[] } => {
  const nodes: TreeNode[] = []
  const array: KeyLabel[] = []

  value.forEach(s => {
    const source: TreeNode = {
      key: `${s.key}`,
      label: `${s.key} (${s.doc_count})`
    }

    nodes.push(source)
    array.push({ key: s.key, label: s.key })

    if (s.collections) {
      source.children = s.collections.map(c => {
        const colNode: TreeNode = {
          key: `${s.key}:${c.key}`,
          label: `${c.key} (${s.doc_count})`
        }

        array.push({ key: colNode.key, label: c.key })

        if (c.references) {
          colNode.children = c.references.map(r => {
            const refNode: TreeNode = {
              key: `${s.key}:${c.key}:${r.key}`,
              label: `${r.key} (${s.doc_count})`
            }

            array.push({ key: refNode.key, label: r.key })

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
  let resourcesArray: KeyLabel[] | undefined = undefined
  let taxonomies: TreeNode[] | undefined = undefined
  let taxonomiesArray: KeyLabel[] | undefined = undefined

  if (contract) {
    if (contract.date_year && contract.date_year.length) {
      rangeVal = mapYearsRangeToFilter(contract.date_year)
    }

    if (contract.source_collection_reference?.sources) {
      const { nodes, array } = mapResourcesToFilter(contract.source_collection_reference.sources)

      resources = nodes
      resourcesArray = array
    }

    if (contract.taxonomies !== undefined) {
      const { nodes, array } = mapTaxonomyToFilter(contract.taxonomies)

      taxonomies = nodes
      taxonomiesArray = array
    }
  }

  return { rangeVal, resources, taxonomies, resourcesArray, taxonomiesArray }
}
