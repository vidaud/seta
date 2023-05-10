import type { MouseEvent } from 'react'
import { useCallback, useRef, useEffect, useState } from 'react'
import { Chip, Flex, clsx } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useTermsSelection } from '~/pages/SearchPageNew/contexts/terms-selection-context'

import * as S from './styles'

export type TermsClusterProps = {
  className?: string
  terms: string[]
  clickable?: boolean
  onSelectedTermsAdd?: (terms: string[]) => void
  onSelectedTermsRemove?: (terms: string[]) => void
}

const TermsCluster = ({
  className,
  terms,
  clickable = false,
  onSelectedTermsAdd,
  onSelectedTermsRemove
}: TermsClusterProps) => {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [prevValues, setPrevValues] = useState<string[]>([])

  const { tokens } = useSearch()
  const { allSelected, setAllSelected } = useTermsSelection()

  const fromEffectRef = useRef(false)
  const fromEffectSelectAllRef = useRef(false)

  const cls = clsx(className, { clickable })

  const updateAllSelected = useCallback(() => {
    const newValue = values.length === terms.length ? true : values.length === 0 ? false : undefined

    if (newValue !== allSelected) {
      setAllSelected(newValue)
    }
  }, [allSelected, setAllSelected, terms, values])

  // Update selected chips when input tokens change
  useEffect(() => {
    if (fromEffectSelectAllRef.current) {
      fromEffectSelectAllRef.current = false

      return
    }

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
    // updateAllSelected()
  }, [onSelectedTermsAdd, onSelectedTermsRemove, prevValues, values, updateAllSelected])

  useEffect(() => {
    if (allSelected === undefined) {
      return
    }

    fromEffectSelectAllRef.current = true

    setValues(allSelected ? [...terms] : [])

    if (clickable) {
      setChecked(allSelected)
    }
  }, [allSelected, terms, clickable])

  const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!clickable) {
      return
    }

    // Don't do anything if the click was on a chip
    if (e.target instanceof HTMLElement && e.target.closest('[data-chip]')) {
      return
    }

    setValues(checked ? [] : [...terms])
    setChecked(current => !current)
  }

  const handleChipsChange = (value: string[]) => {
    if (clickable) {
      setChecked(value.length === terms.length)
    }

    setValues(value)
  }

  return (
    <Flex className={cls} align="center" gap="md" css={S.root} onClick={handleRootClick}>
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
