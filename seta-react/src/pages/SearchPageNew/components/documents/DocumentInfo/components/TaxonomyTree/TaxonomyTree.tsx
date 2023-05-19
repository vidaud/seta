import { useMemo } from 'react'
import { Text } from '@mantine/core'

import type { Taxonomy } from '~/types/search/documents'

import * as S from './styles'
import TaxonomyNode from './TaxonomyNode'

import { buildTaxonomyTree } from '../../utils/taxonomy-tree'

type Props = {
  taxonomy: Taxonomy[]
}

const TaxonomyTree = ({ taxonomy }: Props) => {
  const tree = useMemo(() => buildTaxonomyTree(taxonomy), [taxonomy])

  return (
    <S.Container>
      <Text fz="lg" fw={600} color="gray.8" mb="sm">
        Taxonomy
      </Text>
      {tree.map(node => (
        <TaxonomyNode key={node.code} node={node} css={S.rootNode} />
      ))}
    </S.Container>
  )
}

export default TaxonomyTree
