import { useEffect, useState } from 'react'
import { Flex } from '@mantine/core'

import Page from '~/components/Page'
import { StagedDocumentsProvider } from '~/pages/SearchPageNew/contexts/staged-documents-context'
import SidePanel from '~/pages/SearchWithFilters/components/SidePanel'
import type {
  AdvancedFiltersContract,
  QueryAggregationContract
} from '~/pages/SearchWithFilters/types/contracts'

import { useDocuments, type DocumentsOptions, type DocumentsResponse } from '~/api/search/documents'
import type { Crumb } from '~/types/breadcrumbs'
import { getSearchQueryAndTerms } from '~/utils/search-utils'
import { storage } from '~/utils/storage-utils'

import SearchResults from './components/SearchResults'
import { DocumentsTab } from './components/SearchResultsTabs'
import SearchSuggestionInput from './components/SearchSuggestionInput'
import { EnrichLoadingProvider } from './contexts/enrich-loading-context'
import * as S from './styles'
import type { SearchState, SearchValue } from './types/search'
import { STORAGE_KEY } from './utils/constants'

const searchStorage = storage<string>(STORAGE_KEY.SEARCH)
const uploadsStorage = storage<unknown[]>(STORAGE_KEY.UPLOADS)

const SearchPageNew = () => {
  const [query, setQuery] = useState<SearchState>(null)
  const [searchOptions, setSearchOptions] = useState<DocumentsOptions | undefined>(undefined)
  const [queryContract, setQueryContract] = useState<QueryAggregationContract | null>(null)
  const [enrichLoading, setEnrichLoading] = useState(false)

  const [loadDocsForFilters, setLoadDocsForFilters] = useState(false)

  useDocuments(undefined, undefined, {
    enabled: loadDocsForFilters,

    onSuccess: docs => {
      handleDocumentsChanged(docs)
    }
  })

  useEffect(() => {
    const savedSearch = searchStorage.read()
    const savedUploads = uploadsStorage.read()

    if (savedSearch || savedUploads?.length) {
      return
    }

    setLoadDocsForFilters(true)
  }, [])

  const handleSearch = async ({ tokens, enrichedStatus, embeddings }: SearchValue) => {
    setEnrichLoading(true)

    const { query: value, terms } = await getSearchQueryAndTerms(tokens, enrichedStatus)

    setEnrichLoading(false)
    setQuery({ value, terms, embeddings })
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

  const breadcrumbs: Crumb[] = [
    {
      title: 'Search',
      path: '/search'
    }
  ]

  return (
    <Page sidebarContent={sidebar} breadcrumbs={breadcrumbs}>
      <EnrichLoadingProvider loading={enrichLoading}>
        <Flex direction="column" align="center" css={S.searchWrapper}>
          <SearchSuggestionInput onSearch={handleSearch} />

          <StagedDocumentsProvider>
            <SearchResults>
              <DocumentsTab
                query={query}
                searchOptions={searchOptions}
                onDocumentsChanged={handleDocumentsChanged}
              />
            </SearchResults>
          </StagedDocumentsProvider>
        </Flex>
      </EnrichLoadingProvider>
    </Page>
  )
}

export default SearchPageNew
