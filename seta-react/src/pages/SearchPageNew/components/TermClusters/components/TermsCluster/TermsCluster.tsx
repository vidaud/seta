import type { MouseEvent } from 'react'
import { useRef, useEffect, useState } from 'react'
import { Chip, Flex } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'

import * as S from './styles'

export type TermsClusterProps = {
  className?: string
  terms: string[]
  allSelected?: boolean
  onSelectedTermsAdd?: (terms: string[]) => void
  onSelectedTermsRemove?: (terms: string[]) => void
}

const TermsCluster = ({
  className,
  terms,
  allSelected,
  onSelectedTermsAdd,
  onSelectedTermsRemove
}: TermsClusterProps) => {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [prevValues, setPrevValues] = useState<string[]>([])

  const { tokens } = useSearch()

  const fromEffectRef = useRef(false)

  useEffect(() => {
    if (allSelected === undefined) {
      return
    }

    setValues(allSelected ? [...terms] : [])
    setChecked(allSelected)
  }, [allSelected, terms])

  // Update selected chips when input tokens change
  useEffect(() => {
    const found = tokens
      .filter(({ rawValue }) => terms.includes(rawValue))
      .map(({ rawValue }) => rawValue)

    fromEffectRef.current = true
    setPrevValues(found)
    setValues(found)
    setChecked(found.length === terms.length)
  }, [terms, tokens])

  useEffect(() => {
    // Don't do anything if we're updating the chips because the input tokens changed
    if (fromEffectRef.current) {
      fromEffectRef.current = false

      return
    }

    if (onSelectedTermsAdd) {
      const added = values.filter(value => !prevValues.includes(value))

      if (added.length > 0) {
        onSelectedTermsAdd(added)
      }
    }

    if (onSelectedTermsRemove) {
      const removed = prevValues.filter(value => !values.includes(value))

      if (removed.length > 0) {
        onSelectedTermsRemove(removed)
      }
    }

    setPrevValues(values)
  }, [onSelectedTermsAdd, onSelectedTermsRemove, prevValues, values])

  const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
    // Don't do anything if the click was on a chip
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

  return (
    <Flex className={className} align="center" gap="md" css={S.root} onClick={handleRootClick}>
      <Chip.Group multiple value={values} onChange={handleChipsChange}>
        <Flex wrap="wrap" gap="xs">
          {terms.map(term => (
            <div key={term} data-chip>
              <S.Chip variant="outline" color="teal" size="md" value={term}>
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
