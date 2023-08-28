import { useEffect, useState } from 'react'
import { Alert, Collapse } from '@mantine/core'

import DocumentsTree from '~/pages/SearchPageNew/components/documents/DocumentsTree'

import type { DataProps } from '~/types/data-props'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'

import * as S from './styles'

type Props = DataProps<LibraryItemRaw[]> & {
  saveError?: string
  onSelectedChange?: (value?: LibraryItem) => void
}

const SaveDocumentsContent = ({ saveError, onSelectedChange, ...props }: Props) => {
  const [errorVisible, setErrorVisible] = useState(!!saveError)

  useEffect(() => {
    if (saveError) {
      setErrorVisible(true)
    }
  }, [saveError])

  const errorAlert = !!saveError && (
    <Collapse in={errorVisible}>
      <Alert
        title="Error saving documents"
        color="red"
        variant="outline"
        withCloseButton
        mb="sm"
        onClose={() => setErrorVisible(false)}
      >
        {saveError}
        <br />
        Please try again.
      </Alert>
    </Collapse>
  )

  return (
    <div css={S.contentRoot}>
      {errorAlert}

      <DocumentsTree
        css={S.tree}
        foldersOnly
        selectable
        autoSelect
        onSelectedChange={onSelectedChange}
        {...props}
      />
    </div>
  )
}

export default SaveDocumentsContent
