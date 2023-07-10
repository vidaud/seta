import { Box, Text } from '@mantine/core'

import type { Taxonomy } from '~/types/search/documents'

import * as S from './styles'
import TaxonomyNode from './TaxonomyNode'

type Props = {
  taxonomy: Taxonomy[]
}

const TaxonomyTree = ({ taxonomy }: Props) => {
  const title = taxonomy.length > 1 ? 'Taxonomies' : 'Taxonomy'

  return (
    <Box px="xs">
      <Text fz="lg" fw={600} color="gray.8" mb="sm">
        {title}
      </Text>

      {taxonomy.map(
        // Sometimes there's a 'null' object in the array
        node => node && <TaxonomyNode key={node.code} taxonomy={node} css={S.rootNode} />
      )}
    </Box>
  )
}

export default TaxonomyTree
