import { useEffect, useMemo, useState } from 'react'
import { Flex, Stack, Text } from '@mantine/core'
import { BiSearchAlt } from 'react-icons/bi'

import Page from '~/components/Page/Page'
import { SuggestionsLoading } from '~/pages/SearchPageNew/components/common'
import SidePanel from '~/pages/SearchWithFilters/components/SidePanel'
import type {
  AdvancedFiltersContract,
  QueryAggregationContract
} from '~/pages/SearchWithFilters/types/contracts'

import { useDocuments, type DocumentsOptions, type DocumentsResponse } from '~/api/search/documents'
import type { Crumb } from '~/types/breadcrumbs'
import type { EmbeddingInfo } from '~/types/embeddings'
import { getSearchQueryAndTerms } from '~/utils/search-utils'
import { storage } from '~/utils/storage-utils'

import DocumentsList from './components/documents/DocumentsList'
import SearchSuggestionInput from './components/SearchSuggestionInput'
import { EnrichLoadingProvider } from './contexts/enrich-loading-context'
import * as S from './styles'
import type { SearchValue } from './types/search'
import { STORAGE_KEY } from './utils/constants'

const searchStorage = storage<string>(STORAGE_KEY.SEARCH)
const uploadsStorage = storage<unknown[]>(STORAGE_KEY.UPLOADS)

type SearchState = {
  value: string
  terms: string[]
  embeddings?: EmbeddingInfo[]
} | null

const SearchPageNew = () => {
  const [query, setQuery] = useState<SearchState>(null)
  const [searchOptions, setSearchOptions] = useState<DocumentsOptions | undefined>(undefined)
  const [queryContract, setQueryContract] = useState<QueryAggregationContract | null>(null)
  const [enrichLoading, setEnrichLoading] = useState(false)

  const [loadDocsForFilters, setLoadDocsForFilters] = useState(false)

  useDocuments(undefined, undefined, {
    enabled: loadDocsForFilters,
    staleTime: 0,
    onSuccess: docs => {
      handleDocumentsChanged(docs)
    }
  })

  // If there is a saved search, prepare the loading state
  const initialLoading = useMemo(
    () => !query && (!!searchStorage.read() || !!uploadsStorage.read()?.length),
    [query]
  )

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

  const documentsList = query && (
    <DocumentsList
      query={query.value}
      terms={query.terms}
      embeddings={query.embeddings}
      searchOptions={searchOptions}
      onDocumentsChanged={handleDocumentsChanged}
    />
  )

  const noDocuments =
    !query &&
    (initialLoading ? (
      // Replicate the loading state without rendering the DocumentsList
      // if there are documents to load based on the saved search
      <SuggestionsLoading size="lg" mt="5rem" color="blue" variant="bars" />
    ) : (
      <Stack align="center" css={S.noDocuments}>
        <BiSearchAlt className="icon" />

        <Text mt="md" align="center" fz="lg" color="dimmed" lh={1.6}>
          Enter a few terms and press <strong>Search</strong> to find documents.
        </Text>
      </Stack>
    ))

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

          {documentsList}
          {noDocuments}
        </Flex>
      </EnrichLoadingProvider>
    </Page>
  )
}

export default SearchPageNew
