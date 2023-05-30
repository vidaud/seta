import { useState } from 'react'
import { Flex, Text } from '@mantine/core'
import { CgFileDocument } from 'react-icons/cg'

import Page from '~/components/Page/Page'
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

  const handleDocumentsChanged = (response: DocumentsResponse) => {
    const { search_type } = searchOptions ?? {}
    const { date_year, source_collection_reference, taxonomies } = response.aggregations ?? {}

    setQueryContract({
      date_year,
      search_type,
      source_collection_reference,
      taxonomies
    })
  }

  const sidebar = <SidePanel queryContract={queryContract} onApplyFilter={handleApplyFilter} />

  const documentsList = query && (
    <DocumentsList
      query={query.value}
      terms={query.terms}
      searchOptions={searchOptions}
      onDocumentsChanged={handleDocumentsChanged}
    />
  )

  const noDocuments = !query && (
    <Flex direction="column" align="center" css={S.noDocuments}>
      <CgFileDocument />

      <Text mt="md" align="center">
        Search for documents
      </Text>
    </Flex>
  )

  return (
    <Page sidebarContent={sidebar} breadcrumbs>
      <Flex direction="column" align="center" css={S.searchWrapper}>
        <SearchSuggestionInput onSearch={handleSearch} />

        {documentsList}
        {/* {noDocuments} */}
      </Flex>
    </Page>
  )
}

export default SearchPageNew
