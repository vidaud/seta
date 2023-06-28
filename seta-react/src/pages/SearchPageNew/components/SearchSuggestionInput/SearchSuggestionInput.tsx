import { useCallback, useLayoutEffect, useState } from 'react'
import { Box } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

import SuggestionsPopup from '~/pages/SearchPageNew/components/SuggestionsPopup'
import { SearchProvider } from '~/pages/SearchPageNew/contexts/search-context'
import { SearchInputProvider } from '~/pages/SearchPageNew/contexts/search-input-context'
import { UploadDocumentsProvider } from '~/pages/SearchPageNew/contexts/upload-documents-context'
import type { SearchValue } from '~/pages/SearchPageNew/types/search'
import { EnrichType } from '~/pages/SearchPageNew/types/search'
import type { Token, TokenMatch } from '~/pages/SearchPageNew/types/token'
import { STORAGE_KEY } from '~/pages/SearchPageNew/utils/constants'

import type { ClassNameProp } from '~/types/children-props'
import type { EmbeddingInfo } from '~/types/embeddings'

const getCursorPosition = (input: HTMLInputElement | null | undefined) => {
  if (!input) {
    return 0
  }

  return input.selectionStart ?? 0
}

const setCursorPosition = (input: HTMLInputElement | null | undefined, position: number) => {
  if (!input) {
    return
  }

  setTimeout(() => {
    input.setSelectionRange(position, position)
  }, 100)
}

type Props = {
  onSearch: (value: SearchValue) => void
} & ClassNameProp

const SearchSuggestionInput = ({ className, onSearch }: Props) => {
  const [savedValue, setSavedValue] = useLocalStorage({
    key: STORAGE_KEY.SEARCH,
    defaultValue: '',
    getInitialValueInEffect: true
  })

  const [enrichedStatus, setEnrichedStatus] = useLocalStorage({
    key: STORAGE_KEY.ENRICH,
    defaultValue: {
      enriched: false,
      type: EnrichType.Similar
    },
    getInitialValueInEffect: true
  })

  const [value, setValue] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  useLayoutEffect(() => {
    setValue(savedValue)
  }, [savedValue])

  const handleSuggestionSelected = (suggestion: string) => {
    const replaceWith = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    if (currentToken) {
      const { index, token } = currentToken
      const newValue = value.slice(0, index) + replaceWith + value.slice(index + token.length)

      setValue(newValue)
      setSavedValue(newValue)
    } else {
      setValue(replaceWith)
      setSavedValue(replaceWith)
    }
  }

  const handleTermsAdded = (terms: string[], input?: HTMLInputElement | null) => {
    const newTerms = terms.map(term => (term.match(/\s/g) ? `"${term}"` : term))
    const newValue = `${value} ${newTerms.join(' ')}`

    const pos = getCursorPosition(input)

    setValue(newValue)
    setCursorPosition(input, pos)

    setSavedValue(newValue)
  }

  const handleTermsRemoved = (terms: string[], input?: HTMLInputElement | null) => {
    const newValue = tokens
      .filter(token => !terms.includes(token.rawValue))
      .map(token => token.token)
      .join(' ')

    const pos = getCursorPosition(input)

    setValue(newValue)
    setCursorPosition(input, pos)

    setSavedValue(newValue)
  }

  const handleSearch = useCallback(
    (embeddings?: EmbeddingInfo[]) => {
      onSearch({ value, tokens, enrichedStatus, embeddings })
    },
    [onSearch, value, tokens, enrichedStatus]
  )

  const handleInputBlur = () => {
    setSavedValue(value)
  }

  return (
    <Box className={className}>
      <SearchProvider
        tokens={tokens}
        setTokens={setTokens}
        currentToken={currentToken}
        setCurrentToken={setCurrentToken}
        onSuggestionSelected={handleSuggestionSelected}
        onSelectedTermsAdd={handleTermsAdded}
        onSelectedTermsRemove={handleTermsRemoved}
        onSearch={handleSearch}
      >
        <UploadDocumentsProvider>
          <SearchInputProvider inputValue={value} setInputValue={setValue} onBlur={handleInputBlur}>
            <SuggestionsPopup
              enrichQuery={enrichedStatus.enriched}
              onEnrichToggle={setEnrichedStatus}
            />
          </SearchInputProvider>
        </UploadDocumentsProvider>
      </SearchProvider>
    </Box>
  )
}

export default SearchSuggestionInput
