import { useState } from 'react'
import { Box, Flex } from '@mantine/core'

import SidePanel from '~/pages/SearchWithFilters/components/SidePanel'
import type {
  AdvancedFiltersContract,
  QueryAggregationContract
} from '~/pages/SearchWithFilters/types/contracts'

import type { DocumentsOptions, DocumentsResponse } from '~/api/search/documents'

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
  const [searchOptions, setSearchOptions] = useState<DocumentsOptions | undefined>(undefined)
  const [queryContract, setQueryContract] = useState<QueryAggregationContract | null>(null)

  const handleSearch = ({ tokens }: SearchValue) => {
    const value = buildSearchQuery(tokens)
    const terms = tokens.map(token => token.rawValue)

    setQuery({ value, terms })
  }

  const handleApplyFilter = (value: AdvancedFiltersContract) => {
    setSearchOptions(value)
  }

  const handleDocumentsLoaded = (response: DocumentsResponse) => {
    const { search_type } = searchOptions ?? {}
    const { date_year, source_collection_reference, taxonomies } = response.aggregations ?? {}

    setQueryContract({
      date_year,
      search_type,
      source_collection_reference,
      taxonomies
    })
  }

  return (
    <Flex css={S.pageWrapper}>
      <Box sx={{ position: 'sticky', top: 0 }}>
        <SidePanel
          css={S.sidebar}
          queryContract={queryContract}
          onApplyFilter={handleApplyFilter}
        />
      </Box>

      <Flex direction="column" align="center" css={S.searchWrapper}>
        <SearchSuggestionInput onSearch={handleSearch} />

        {query && (
          <DocumentsList
            query={query.value}
            terms={query.terms}
            searchOptions={searchOptions}
            onDocumentsLoaded={handleDocumentsLoaded}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default SearchPageNew
