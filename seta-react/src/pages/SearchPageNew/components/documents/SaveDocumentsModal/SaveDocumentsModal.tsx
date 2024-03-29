import { useState } from 'react'
import { Stack, type ModalProps, Text, Group, Button } from '@mantine/core'
import { IconWallet } from '@tabler/icons-react'

import CancelButton from '~/components/CancelButton'
import ScrollModal from '~/components/ScrollModal'
import { ROOT_NODE_ID } from '~/pages/SearchPageNew/components/documents/LibraryTree/constants'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import { useLibrary } from '~/api/search/library'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'
import type { Document } from '~/types/search/documents'
import { pluralize } from '~/utils/string-utils'

import SaveDocumentsContent from './components/SaveDocumentsContent'

const pathToString = (path: string[] = []): string => path.join(' / ')

const getTitleAndLabel = (
  libraryItem: LibraryItem | undefined,
  documents: Document[] | StagedDocument[] | undefined
) => {
  const subject = libraryItem && libraryItem.type === LibraryItemType.Folder ? 'folder' : 'document'
  const target: Document | StagedDocument | LibraryItem | undefined = libraryItem ?? documents?.[0]
  const operation = libraryItem ? 'Move' : 'Save'

  const hasOneDocument = !!libraryItem || documents?.length === 1

  const pluralizedSave = `Save ${documents?.length} ${pluralize(
    'document',
    documents?.length ?? 0
  )}`

  const title = hasOneDocument ? `${operation} "${target?.title}"` : pluralizedSave
  const saveLabel = hasOneDocument ? `${operation} ${subject}` : pluralizedSave

  return { title, saveLabel }
}

type Props = ModalProps & {
  // Save documents
  documents?: Document[] | StagedDocument[]
  // Or move a library item
  libraryItem?: LibraryItem
  saving?: boolean
  saveError?: string
  onSave?: (target: LibraryItem) => void
}

const SaveDocumentsModal = ({
  documents,
  libraryItem,
  saving,
  saveError,
  onSave,
  onClose,
  ...props
}: Props) => {
  const [selectedTarget, setSelectedTarget] = useState<LibraryItem | undefined>()

  const { data, error, isLoading } = useLibrary()

  if (!libraryItem && (!documents || !documents.length)) {
    return null
  }

  const handleSelectedChange = (item?: LibraryItem) => {
    setSelectedTarget(item)
  }

  const handleSaveClick = () => {
    if (selectedTarget) {
      onSave?.(selectedTarget)
    }
  }

  const { title, saveLabel } = getTitleAndLabel(libraryItem, documents)

  const path = selectedTarget ? ['My Library', ...selectedTarget.path] : undefined

  // Disable the save button if the target is the same as the source
  // and we are moving a library item
  const targetSameAsSource =
    !!libraryItem && selectedTarget?.id === (libraryItem.parentId ?? ROOT_NODE_ID)

  const titleEl = (
    <Stack spacing={4}>
      <Text lh={1.3}>{title} to:</Text>

      <Text size="sm" color="gray">
        {pathToString(path) || '...'}
      </Text>
    </Stack>
  )

  const actions = (
    <Group spacing="sm">
      <CancelButton onClick={onClose} />

      <Button
        color="blue"
        onClick={handleSaveClick}
        disabled={isLoading || !!error || targetSameAsSource}
        loading={saving}
      >
        {saveLabel}
      </Button>
    </Group>
  )

  const icon = <IconWallet size={26} />

  return (
    <ScrollModal {...props} icon={icon} title={titleEl} actions={actions} onClose={onClose}>
      <SaveDocumentsContent
        data={data?.items}
        documents={documents}
        libraryItem={libraryItem}
        isLoading={isLoading}
        error={error}
        saveError={saveError}
        onSelectedChange={handleSelectedChange}
      />
    </ScrollModal>
  )
}

export default SaveDocumentsModal
