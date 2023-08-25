import ClosableAlert from '~/components/ClosableAlert/ClosableAlert'
import DocumentsTree from '~/pages/SearchPageNew/components/documents/DocumentsTree'

import type { DataProps } from '~/types/data-props'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'

import * as S from './styles'

type Props = DataProps<LibraryItemRaw[]> & {
  saveError?: string
  onSelectedChange?: (value?: LibraryItem) => void
}

const SaveDocumentsContent = ({ saveError, onSelectedChange, ...props }: Props) => {
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

      <DocumentsTree
        css={S.tree}
        foldersOnly
        selectable
        noActionMenu
        autoSelect
        onSelectedChange={onSelectedChange}
        {...props}
      />
    </div>
  )
}

export default SaveDocumentsContent
