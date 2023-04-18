import { useState } from 'react'
import { Checkbox, Chip, Flex } from '@mantine/core'

import * as S from './styles'

type Props = {
  className?: string
  terms: string[]
}

const TermsCluster = ({ className, terms }: Props) => {
  const [values, setValues] = useState<string[]>([])

  const variant = (term: string) => {
    console.log('term', term)

    return values.includes(term) ? 'filled' : 'outline'
  }

  return (
    <Flex className={className} align="center" gap="md" css={S.root}>
      <Checkbox size="md" />

      <Chip.Group multiple value={values} onChange={setValues}>
        <Flex wrap="wrap" gap="xs">
          {terms.map((term, index) => (
            <Chip
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              css={S.chip}
              variant="outline"
              color="teal"
              size="md"
              value={term}
            >
              {term}
            </Chip>
          ))}
        </Flex>
      </Chip.Group>
    </Flex>
  )
}

export default TermsCluster
