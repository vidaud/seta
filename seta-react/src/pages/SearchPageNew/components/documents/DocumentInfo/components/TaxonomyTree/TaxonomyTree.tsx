import { Text } from '@mantine/core'

import type { Taxonomy } from '~/types/search/documents'

import * as S from './styles'
import TaxonomyNode from './TaxonomyNode'

type Props = {
  taxonomy: Taxonomy[]
}

//!sometimes there's a 'null' object in the array
const TaxonomyTree = ({ taxonomy }: Props) => {
  return (
    <S.Container>
      <Text fz="lg" fw={600} color="gray.8" mb="sm">
        Taxonomy
      </Text>
      {taxonomy.map(
        node => node && <TaxonomyNode key={node.code} taxonomy={node} css={S.rootNode} />
      )}
    </S.Container>
  )
}

export default TaxonomyTree
