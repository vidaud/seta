import { useState } from 'react'
import { Stack, type ModalProps, Text, Group, Button } from '@mantine/core'
import { IconWallet } from '@tabler/icons-react'

import CancelButton from '~/components/CancelButton'
import ScrollModal from '~/components/ScrollModal'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import { useLibrary } from '~/api/search/library'
import type { LibraryItem } from '~/types/library/library-item'
import type { Document } from '~/types/search/documents'
import { pluralize } from '~/utils/string-utils'

import SaveDocumentsContent from './SaveDocumentsContent'

const pathToString = (path: string[] = []): string => path.join(' / ')

type Props = ModalProps & {
  documents: Document[] | StagedDocument[]
  saving?: boolean
  saveError?: string
  onSave?: (target: LibraryItem) => void
}

const SaveDocumentsModal = ({ documents, saving, saveError, onSave, onClose, ...props }: Props) => {
  const [selectedTarget, setSelectedTarget] = useState<LibraryItem | undefined>()

  const { data, error, isLoading } = useLibrary()

  const handleSelectedChange = (item?: LibraryItem) => {
    setSelectedTarget(item)
  }

  const handleSaveClick = () => {
    if (selectedTarget) {
      onSave?.(selectedTarget)
    }
  }

  const hasOneDocument = documents.length === 1

  const pluralizedSave = `Save ${documents.length} ${pluralize('document', documents.length)}`

  const title = hasOneDocument ? `Save "${documents[0].title}"` : pluralizedSave
  const saveLabel = hasOneDocument ? 'Save document' : pluralizedSave

  const titleEl = (
    <Stack spacing={4}>
      <Text lh={1.3}>{title} to:</Text>

      <Text size="sm" color="gray">
        {pathToString(selectedTarget?.path) || '...'}
      </Text>
    </Stack>
  )

  const actions = (
    <Group spacing="sm">
      <CancelButton onClick={onClose} />

      <Button
        color="blue"
        onClick={handleSaveClick}
        disabled={isLoading || !!error}
        loading={saving}
        loaderPosition="center"
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
        isLoading={isLoading}
        error={error}
        saveError={saveError}
        onSelectedChange={handleSelectedChange}
      />
    </ScrollModal>
  )
}

export default SaveDocumentsModal
