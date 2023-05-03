import { createContext, useContext, useRef } from 'react'

import type { ChildrenProp } from '~/types/children-props'

import type { Token, TokenMatch } from '../types/token'

type SearchProviderProps = {
  onSuggestionSelected?: (suggestion: string) => void
  inputValue: string
  setInputValue: (value: string) => void
  tokens: Token[]
  setTokens: (tokens: Token[]) => void
  currentToken: TokenMatch | null
  setCurrentToken: (token: TokenMatch | null) => void
  onSelectedTermsAdd: (terms: string[]) => void
  onSelectedTermsRemove: (terms: string[]) => void
}

type SearchContextProps = SearchProviderProps & {
  input: HTMLInputElement | null
  setInputRef: (ref: HTMLInputElement) => void
  setPosition: (position: number) => void
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined)

export const SearchProvider = ({
  children,
  inputValue,
  setInputValue,
  tokens,
  setTokens,
  currentToken,
  setCurrentToken,
  onSuggestionSelected,
  onSelectedTermsAdd,
  onSelectedTermsRemove
}: SearchProviderProps & ChildrenProp) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const setInputRef = (ref: HTMLInputElement) => {
    inputRef.current = ref
  }

  const setPosition = (position: number) => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(position, position)
    }
  }

  const value: SearchContextProps = {
    inputValue,
    setInputValue,
    tokens,
    setTokens,
    currentToken,
    setCurrentToken,
    onSuggestionSelected,
    onSelectedTermsAdd,
    onSelectedTermsRemove,
    input: inputRef.current,
    setInputRef,
    setPosition
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
