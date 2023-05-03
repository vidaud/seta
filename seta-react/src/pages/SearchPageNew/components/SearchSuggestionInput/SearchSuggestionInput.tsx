import { useState } from 'react'

import SuggestionsPopup from '~/pages/SearchPageNew/components/SuggestionsPopup'
import { SearchProvider } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { SearchInputProvider } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'
import type {
  Token,
  TokenMatch
} from '~/pages/SearchPageNew/components/SuggestionsPopup/types/token'

const SearchSuggestionInput = () => {
  const [value, setValue] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  const handleSuggestionSelected = (suggestion: string) => {
    const replaceWith = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    if (currentToken) {
      const { index, token } = currentToken
      const newValue = value.slice(0, index) + replaceWith + value.slice(index + token.length)

      setValue(newValue)
    }
  }

  const handleTermsAdded = (terms: string[]) => {
    const newTerms = terms.map(term => (term.match(/\s/g) ? `"${term}"` : term))
    const newValue = `${value} ${newTerms.join(' ')}`

    setValue(newValue)
  }

  const handleTermsRemoved = (terms: string[]) => {
    const newValue = terms.reduce(
      (acc, term) => acc.replace(term.match(/\s/g) ? ` "${term}"` : ` ${term}`, ''),
      value
    )

    setValue(newValue)
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
    >
      <SearchInputProvider inputValue={value} setInputValue={setValue}>
        <SuggestionsPopup />
      </SearchInputProvider>
    </SearchProvider>
  )
}

export default SearchSuggestionInput
