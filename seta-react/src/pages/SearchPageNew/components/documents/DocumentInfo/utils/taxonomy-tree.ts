import type { Taxonomy } from '~/types/search/documents'

export type TaxonomyTreeNode = Taxonomy & {
  children: TaxonomyTreeNode[]
}

export const buildTaxonomyTree = (taxonomies: Taxonomy[]): TaxonomyTreeNode[] => {
  const map = new Map<string, TaxonomyTreeNode>()
  const roots: TaxonomyTreeNode[] = []

  // First pass: create nodes for each taxonomy code
  for (const taxonomy of taxonomies) {
    const code = taxonomy.code
    const node: TaxonomyTreeNode = { ...taxonomy, children: [] }

    map.set(code, node)
  }

  // Second pass: link nodes together
  for (const [code, node] of map) {
    const parentCode = code.split('/').slice(0, -1).join('/')

    if (parentCode) {
      const parent = map.get(parentCode)

      if (parent) {
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  return roots
}
