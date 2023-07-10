import type { Taxonomy } from '~/types/search/documents'

export type TaxonomyRoot = {
  root: Taxonomy
  leaves: Taxonomy[]
}

const getTaxonomyLeaves = (root: Taxonomy): Taxonomy[] => {
  const leaves: Taxonomy[] = []

  if (!root.subcategories.length) {
    if (root) {
      leaves.push(root)
    }
  } else {
    for (const subcategory of root.subcategories) {
      leaves.push(...getTaxonomyLeaves(subcategory))
    }
  }

  return leaves
}

export const getTaxonomyRootWithLeaves = (taxonomies: Taxonomy[]): TaxonomyRoot[] => {
  const results: TaxonomyRoot[] = []

  for (const taxonomy of taxonomies) {
    const root: TaxonomyRoot = {
      root: taxonomy,
      leaves: getTaxonomyLeaves(taxonomy)
    }

    results.push(root)
  }

  return results
}
