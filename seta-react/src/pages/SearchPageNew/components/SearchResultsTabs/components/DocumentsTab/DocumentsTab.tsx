import { useMemo } from 'react'
import { Stack, Text } from '@mantine/core'
import { BiSearchAlt } from 'react-icons/bi'

import { TabPanel } from '~/components/Tabs'
import { SuggestionsLoading } from '~/pages/SearchPageNew/components/common'
import DocumentsList from '~/pages/SearchPageNew/components/documents/DocumentsList'
import type { SearchState } from '~/pages/SearchPageNew/types/search'
import { ResultsTab } from '~/pages/SearchPageNew/types/tabs'
import { STORAGE_KEY } from '~/pages/SearchPageNew/utils/constants'

import type { DocumentsOptions, DocumentsResponse } from '~/api/search/documents'
import { storage } from '~/utils/storage-utils'

import * as S from './styles'

const searchStorage = storage<string>(STORAGE_KEY.SEARCH)
const uploadsStorage = storage<unknown[]>(STORAGE_KEY.UPLOADS)

type Props = {
  query: SearchState
  searchOptions: DocumentsOptions | undefined
  onDocumentsChanged?: (docs: DocumentsResponse) => void
}

const DocumentsTab = ({ query, searchOptions, onDocumentsChanged }: Props) => {
  // If there is a saved search, prepare the loading state
  const initialLoading = useMemo(
    () => !query && (!!searchStorage.read() || !!uploadsStorage.read()?.length),
    [query]
  )

  const documentsList = query && (
    <DocumentsList
      query={query.value}
      terms={query.terms}
      embeddings={query.embeddings}
      searchOptions={searchOptions}
      onDocumentsChanged={onDocumentsChanged}
    />
  )

  const noDocuments =
    !query &&
    (initialLoading ? (
      // Replicate the loading state without rendering the DocumentsList
      // if there are documents to load based on the saved search
      <SuggestionsLoading size="lg" mt="5rem" color="blue" variant="bars" />
    ) : (
      <Stack align="center" css={S.noDocuments} id="document-list">
        <BiSearchAlt className="icon" />

        <Text mt="md" align="center" fz="lg" color="dimmed" lh={1.6}>
          Enter a few terms and press <strong>Search</strong> to find documents.
        </Text>
      </Stack>
    ))

  return (
    <TabPanel value={ResultsTab.DOCUMENTS}>
      {documentsList}
      {noDocuments}
    </TabPanel>
  )
}

export default DocumentsTab
