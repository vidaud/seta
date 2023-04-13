import { useState } from 'react'

import SuggestionsPopup from '~/pages/SearchPageNew/components/SuggestionsPopup'
import { SearchProvider } from '~/pages/SearchPageNew/contexts/search-context'
import { SearchInputProvider } from '~/pages/SearchPageNew/contexts/search-input-context'
import type { Token, TokenMatch } from '~/pages/SearchPageNew/types/token'

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
  onSearch: (value: string) => void
}

const SearchSuggestionInput = ({ onSearch }: Props) => {
  const [value, setValue] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  const handleSuggestionSelected = (suggestion: string) => {
    const replaceWith = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    if (currentToken) {
      const { index, token } = currentToken
      const newValue = value.slice(0, index) + replaceWith + value.slice(index + token.length)

      setValue(newValue)
    } else {
      setValue(replaceWith)
    }
  }

  const handleTermsAdded = (terms: string[], input?: HTMLInputElement | null) => {
    const newTerms = terms.map(term => (term.match(/\s/g) ? `"${term}"` : term))
    const newValue = `${value} ${newTerms.join(' ')}`

    const pos = getCursorPosition(input)

    setValue(newValue)
    setCursorPosition(input, pos)
  }

  const handleTermsRemoved = (terms: string[], input?: HTMLInputElement | null) => {
    const newValue = tokens
      .filter(token => !terms.includes(token.rawValue))
      .map(token => token.token)
      .join(' ')

    const pos = getCursorPosition(input)

    setValue(newValue)
    setCursorPosition(input, pos)
  }

  const handleSearch = () => {
    onSearch(value)
  }

  return (
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
      <SearchInputProvider inputValue={value} setInputValue={setValue}>
        <SuggestionsPopup />
      </SearchInputProvider>
    </SearchProvider>
  )
}

export default SearchSuggestionInput
