import { Checkbox, Chip, Flex } from '@mantine/core'

import * as S from './styles'

type Props = {
  className?: string
  terms: string[]
}

const TermsCluster = ({ className, terms }: Props) => {
  return (
    <Flex className={className} align="center" gap="md" css={S.root}>
      <Checkbox size="md" />

      <Chip.Group>
        <Flex wrap="wrap" gap="xs">
          {terms.map((term, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Chip key={index} css={S.chip} variant="outline" size="md">
              {term}
            </Chip>
          ))}
        </Flex>
      </Chip.Group>
    </Flex>
  )
}

export default TermsCluster
