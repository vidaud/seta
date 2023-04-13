import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Flex, clsx } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/contexts/search-input-context'
import { useTermsSelection } from '~/pages/SearchPageNew/contexts/terms-selection-context'

import * as S from './styles'

export type TermsClusterProps = {
  className?: string
  terms: string[]
  clickable?: boolean
}

const TermsCluster = ({ className, terms, clickable = false }: TermsClusterProps) => {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [prevValues, setPrevValues] = useState<string[]>([])

  const { tokens, onSelectedTermsAdd, onSelectedTermsRemove } = useSearch()
  const { setAllSelectedChecked } = useTermsSelection()
  const { input } = useSearchInput()

  const fromEffectRef = useRef(false)

  const cls = clsx(className, { clickable })

  // Update selected chips when input tokens change
  useEffect(() => {
    const found = tokens
      .filter(({ rawValue }) => terms.includes(rawValue))
      .map(({ rawValue }) => rawValue)

    fromEffectRef.current = true

    setPrevValues(found)
    setValues(found)

    if (clickable) {
      setChecked(found.length === terms.length)
    }
  }, [terms, tokens, clickable])

  useEffect(() => {
    // Don't do anything if we're updating the chips because the input tokens changed
    if (fromEffectRef.current) {
      fromEffectRef.current = false

      return
    }

    if (onSelectedTermsAdd) {
      const added = values.filter(value => !prevValues.includes(value))

      if (added.length > 0) {
        onSelectedTermsAdd(added, input)
      }
    }

    if (onSelectedTermsRemove) {
      const removed = prevValues.filter(value => !values.includes(value))

      if (removed.length > 0) {
        onSelectedTermsRemove(removed, input)
        setAllSelectedChecked(false)
      }
    }

    setPrevValues(values)
  }, [
    onSelectedTermsAdd,
    onSelectedTermsRemove,
    prevValues,
    values,
    setAllSelectedChecked,
    input,
    terms
  ])

  const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
    const chip = e.target instanceof HTMLElement && e.target.closest('[data-term]')

    if (chip) {
      const term = (chip as HTMLElement).dataset.term

      handleChipClick(term)

      // Return if the click was on a chip
      return
    }

    if (!clickable) {
      return
    }

    setValues(checked ? [] : [...terms])
    setChecked(current => !current)
  }

  const handleChipClick = (term?: string) => {
    if (!term) {
      return
    }

    if (values.includes(term)) {
      setValues(values.filter(value => value !== term))
    } else {
      setValues([...values, term])
    }
  }

  const isSelected = (term: string) => values.includes(term)

  return (
    <Flex
      className={cls}
      wrap="wrap"
      align="center"
      gap="xs"
      css={S.root}
      onClick={handleRootClick}
    >
      {terms.map(term => (
        <S.TermChip key={term} data-term={term} data-selected={isSelected(term)}>
          {term}
        </S.TermChip>
      ))}
    </Flex>
  )
}

export default TermsCluster
