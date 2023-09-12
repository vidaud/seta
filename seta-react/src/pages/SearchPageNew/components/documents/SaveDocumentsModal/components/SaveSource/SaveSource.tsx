import { Stack } from '@mantine/core'
import { ImArrowDown2 } from 'react-icons/im'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import type { LibraryItem } from '~/types/library/library-item'
import type { Document } from '~/types/search/documents'

import DocumentsSource from './components/DocumentsSource'
import ItemSource from './components/ItemSource'
import * as S from './styles'

type Props = {
  // Saving documents
  documents?: Document[] | StagedDocument[]
  // Or moving a library item
  libraryItem?: LibraryItem
}

const SaveSource = ({ documents, libraryItem }: Props) => {
  const source = libraryItem ? (
    <ItemSource libraryItem={libraryItem} />
  ) : documents ? (
    <DocumentsSource documents={documents} />
  ) : null

  return (
    <Stack align="center" spacing="sm" mb="sm">
      <div css={S.source}>{source}</div>

      <ImArrowDown2 size={18} css={S.arrowDown} />
    </Stack>
  )
}

export default SaveSource
