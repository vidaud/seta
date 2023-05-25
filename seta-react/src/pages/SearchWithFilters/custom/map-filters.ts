import type { QueryAggregationContract, SourceInfo, Taxonomy, YearCount } from '../types/contracts'
import type { RangeValue } from '../types/filters'

const mapYearsRangeToFilter = (value: YearCount[]): RangeValue => {
  const years = value.map(v => Number(v.year))

  return [Math.min(...years), Math.max(...years)]
}

const mapTaxonomyCategories = (parentId: string, parentLabel?: string, value?: Taxonomy[]) => {
  if (!value?.length) {
    return undefined
  }

  return value.map(c => {
    return {
      key: `${parentId}:${c.name_in_path}`,
      label: `${c.label ?? ''} (${c.doc_count})`,
      children: mapTaxonomyCategories(c.name_in_path, c.label, c.subcategories)
    }
  })
}

const mapTaxonomyToFilter = (value: Taxonomy[]) => {
  return value.map(t => {
    return {
      key: t.name_in_path,
      label: `${t.label} (${t.doc_count})`,
      children: mapTaxonomyCategories(t.name_in_path, t.label, t.subcategories)
    }
  })
}

const mapResourcesToFilter = (value: SourceInfo[]) => {
  return value.map(s => {
    const source = {
      key: `${s.key}`,
      label: `${s.key} (${s.doc_count})`
    }

    if (s.collections) {
      source['children'] = s.collections.map(c => {
        const col = {
          key: `${s.key}:${c.key}`,
          label: `${c.key} (${s.doc_count})`
        }

        if (c.references) {
          col['children'] = c.references.map(r => {
            return {
              key: `${s.key}:${c.key}:${r.key}`,
              label: `${r.key} (${s.doc_count})`
            }
          })
        }

        return col
      })
    }

    return source
  })
}

type TreeNode = {
  key: string
  label: string
  children?: TreeNode[]
}

export const parseQueryContract = (contract?: QueryAggregationContract | null) => {
  let rangeVal: RangeValue | undefined = undefined
  let resources: TreeNode[] | undefined = undefined
  let taxonomies: TreeNode[] | undefined = undefined

  if (contract) {
    if (contract.date_year && contract.date_year.length) {
      rangeVal = mapYearsRangeToFilter(contract.date_year)
    }

    if (contract.source_collection_reference?.sources) {
      resources = mapResourcesToFilter(contract.source_collection_reference.sources)
    }

    if (contract.taxonomies !== undefined) {
      taxonomies = mapTaxonomyToFilter(contract.taxonomies)
    }
  }

  return { rangeVal, resources, taxonomies }
}
