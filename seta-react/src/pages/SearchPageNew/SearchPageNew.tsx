import { useState } from 'react'
import { Flex } from '@mantine/core'

import DocumentsList from './components/documents/DocumentsList'
import SearchSuggestionInput from './components/SearchSuggestionInput'
import * as S from './styles'
import type { SearchValue } from './types/search'
import { buildSearchQuery } from './utils/search-utils'

type SearchState = {
  value: string
  terms: string[]
} | null

const SearchPageNew = () => {
  const [query, setQuery] = useState<SearchState>(null)

  const handleSearch = ({ tokens }: SearchValue) => {
    const value = buildSearchQuery(tokens)
    const terms = tokens.map(token => token.rawValue)

    setQuery({ value, terms })
  }

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SearchSuggestionInput onSearch={handleSearch} />

      {query && <DocumentsList query={query.value} terms={query.terms} />}
    </Flex>
  )
}

export default SearchPageNew
