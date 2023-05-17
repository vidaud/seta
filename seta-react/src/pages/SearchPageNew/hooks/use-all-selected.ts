import { useEffect, useMemo } from 'react'

import { useSearch } from '../contexts/search-context'
import { useSearchInput } from '../contexts/search-input-context'
import { useTermsSelection } from '../contexts/terms-selection-context'

const useAllSelected = (terms: string[]) => {
  const { onSelectedTermsAdd, onSelectedTermsRemove, tokens } = useSearch()
  const { input } = useSearchInput()
  const { allSelected, setAllSelected, setAllSelectedChecked } = useTermsSelection()

  const tokenValues = useMemo(() => tokens.map(({ rawValue }) => rawValue), [tokens])

  const allTermsSelected = useMemo(
    () =>
      !!terms.length &&
      tokenValues.length >= terms.length &&
      terms.every(value => tokenValues.includes(value)),
    [tokenValues, terms]
  )

  useEffect(() => {
    setAllSelectedChecked(allTermsSelected)
  }, [allTermsSelected, setAllSelectedChecked])

  useEffect(() => {
    if (allSelected === undefined) {
      return
    }

    const existing = tokens.map(({ rawValue }) => rawValue)

    if (allSelected) {
      const added = terms.filter(value => !existing.includes(value))

      if (added.length > 0) {
        onSelectedTermsAdd(added, input)
      }
    } else {
      const removed = tokens
        .filter(({ rawValue }) => terms.includes(rawValue))
        .map(({ rawValue }) => rawValue)

      if (removed.length > 0) {
        onSelectedTermsRemove(removed, input)
      }
    }

    setAllSelected(undefined)
  }, [allSelected, onSelectedTermsAdd, onSelectedTermsRemove, tokens, terms, setAllSelected, input])
}

export default useAllSelected
