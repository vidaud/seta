import ClosableAlert from '~/components/ClosableAlert/ClosableAlert'
import LibraryTree from '~/pages/SearchPageNew/components/documents/LibraryTree'

import type { DataProps } from '~/types/data-props'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'

import * as S from './styles'

type Props = DataProps<LibraryItemRaw[]> & {
  libraryItem?: LibraryItem
  saveError?: string
  onSelectedChange?: (value?: LibraryItem) => void
}

const SaveDocumentsContent = ({ libraryItem, saveError, onSelectedChange, ...props }: Props) => {
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

      <LibraryTree
        css={S.tree}
        foldersOnly
        selectable
        noActionMenu
        autoSelect
        excludeItem={libraryItem}
        onSelectedChange={onSelectedChange}
        {...props}
      />
    </div>
  )
}

export default SaveDocumentsContent
