import type { ChangeEvent, MouseEvent } from 'react'
import { useState } from 'react'
import { Chip, Flex } from '@mantine/core'

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
    if (e.target instanceof HTMLElement && e.target.closest('[data-chip]')) {
      return
    }

    setValues(checked ? [] : [...terms])
    setChecked(current => !current)
  }

  const handleChipsChange = (value: string[]) => {
    setChecked(value.length === terms.length)
    setValues(value)
  }

  // useEffect(() => {
  //   setValues(checked ? [...terms] : [])
  // }, [checked, terms])

  return (
    <Flex className={className} align="center" gap="md" css={S.root} onClick={handleRootClick}>
      {/* <Checkbox size="md" color="gray" checked={checked} onChange={handledCheckedChange} /> */}

      <Chip.Group multiple value={values} onChange={handleChipsChange}>
        <Flex wrap="wrap" gap="xs">
          {terms.map((term, index) => (
            // TODO: deduplicate terms and use term as key
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} data-chip>
              <S.Chip
                // key={index}
                variant="outline"
                color="teal"
                size="md"
                value={term}
              >
                {term}
              </S.Chip>
            </div>
          ))}
        </Flex>
      </Chip.Group>
    </Flex>
  )
}

export default TermsCluster
