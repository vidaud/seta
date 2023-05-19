import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'

import type { Token, TokenMatch } from '../types/token'

type SearchProviderProps = {
  onSuggestionSelected?: (suggestion: string) => void
  tokens: Token[]
  setTokens: (tokens: Token[]) => void
  currentToken: TokenMatch | null
  setCurrentToken: (token: TokenMatch | null) => void
  onSelectedTermsAdd: (terms: string[]) => void
  onSelectedTermsRemove: (terms: string[]) => void
}

type SearchContextProps = SearchProviderProps

const SearchContext = createContext<SearchContextProps | undefined>(undefined)

export const SearchProvider = ({
  children,
  tokens,
  setTokens,
  currentToken,
  setCurrentToken,
  onSuggestionSelected,
  onSelectedTermsAdd,
  onSelectedTermsRemove
}: SearchProviderProps & ChildrenProp) => {
  const value: SearchContextProps = {
    tokens,
    setTokens,
    currentToken,
    setCurrentToken,
    onSuggestionSelected,
    onSelectedTermsAdd,
    onSelectedTermsRemove
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }

  return context
}
