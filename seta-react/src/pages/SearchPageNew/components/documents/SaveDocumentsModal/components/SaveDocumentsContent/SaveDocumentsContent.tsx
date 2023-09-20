import ClosableAlert from '~/components/ClosableAlert/ClosableAlert'
import LibraryTree from '~/pages/SearchPageNew/components/documents/LibraryTree'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import type { DataProps } from '~/types/data-props'
import type { LibraryItem } from '~/types/library/library-item'
import type { Document } from '~/types/search/documents'

import * as S from './styles'

import SaveSource from '../SaveSource'

type Props = DataProps<LibraryItem[]> & {
  documents?: Document[] | StagedDocument[]
  libraryItem?: LibraryItem
  saveError?: string
  onSelectedChange?: (value?: LibraryItem) => void
}

const SaveDocumentsContent = ({
  documents,
  libraryItem,
  saveError,
  onSelectedChange,
  ...props
}: Props) => {
  const errorAlert = !!saveError && (
    <ClosableAlert title="Error saving documents" color="red" variant="outline" mb="sm">
      {saveError}
      <br />
      Please try again.
    </ClosableAlert>
  )

  return (
    <div css={S.contentRoot}>
      {errorAlert}

      <SaveSource libraryItem={libraryItem} documents={documents} />

      <LibraryTree
        css={S.tree}
        foldersOnly
        selectable
        noActionMenu
        autoSelectRoot
        disabledIds={libraryItem ? [libraryItem.id] : undefined}
        disabledBadge="Moving this"
        onSelectedChange={onSelectedChange}
        {...props}
      />
    </div>
  )
}

export default SaveDocumentsContent
