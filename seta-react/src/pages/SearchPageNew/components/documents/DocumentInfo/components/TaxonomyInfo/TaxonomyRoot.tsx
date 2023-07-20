import { Text } from '@mantine/core'

import type { TaxonomyRoot as TaxonomyWithLeaves } from '~/pages/SearchPageNew/utils/taxonomy'

import * as S from './styles'

type Props = {
  root: TaxonomyWithLeaves
}

const TaxonomyRoot = ({ root: { root, leaves } }: Props) => (
  <div css={S.taxonomyRoot}>
    <Text fw={500} color="teal.8" mb={2}>
      {root.label}
    </Text>

    {leaves.map(({ code, label }) => (
      <span css={S.item} key={code}>
        {label}
      </span>
    ))}
  </div>
)

export default TaxonomyRoot
