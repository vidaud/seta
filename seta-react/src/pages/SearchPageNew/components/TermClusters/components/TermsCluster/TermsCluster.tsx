import type { ChangeEvent, MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { Checkbox, Chip, Flex } from '@mantine/core'

import * as S from './styles'

type Props = {
  className?: string
  terms: string[]
}

const TermsCluster = ({ className, terms }: Props) => {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>([])

  const handledCheckedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked

    setChecked(value)
  }

  const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
    // const target = e.target
    // console.log('target', target)
    // setChecked(prev => !prev)
  }

  useEffect(() => {
    setValues(checked ? [...terms] : [])
  }, [checked, terms])

  return (
    <Flex className={className} align="center" gap="md" css={S.root} onClick={handleRootClick}>
      <Checkbox size="md" color="gray" checked={checked} onChange={handledCheckedChange} />

      <Chip.Group multiple value={values} onChange={setValues}>
        <Flex wrap="wrap" gap="xs">
          {terms.map((term, index) => (
            <S.Chip
              // TODO: deduplicate terms and use term as key
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              variant="outline"
              color="teal"
              size="md"
              value={term}
            >
              {term}
            </S.Chip>
          ))}
        </Flex>
      </Chip.Group>
    </Flex>
  )
}

export default TermsCluster
