import { createContext, useContext, useRef } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type SearchInputProviderProps = {
  inputValue: string
  setInputValue: (value: string) => void
}

type SearchInputContextProps = SearchInputProviderProps & {
  input: HTMLInputElement | null
  setInputRef: (ref: HTMLInputElement) => void
  setPosition: (position: number) => void
}

const SearchInputContext = createContext<SearchInputContextProps | undefined>(undefined)

export const SearchInputProvider = ({
  children,
  inputValue,
  setInputValue
}: SearchInputProviderProps & ChildrenProp) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const setInputRef = (ref: HTMLInputElement) => {
    inputRef.current = ref
  }

  const setPosition = (position: number) => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(position, position)
    }
  }

  const value: SearchInputContextProps = {
    inputValue,
    setInputValue,
    input: inputRef.current,
    setInputRef,
    setPosition
  }

  return <SearchInputContext.Provider value={value}>{children}</SearchInputContext.Provider>
}

export const useSearchInput = () => {
  const context = useContext(SearchInputContext)

  if (context === undefined) {
    throw new Error('useSearchInput must be used within a SearchInputProvider')
  }

  return context
}
