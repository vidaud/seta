import { useMemo, useState } from 'react'
import type { ModalProps } from '@mantine/core'
import { Group, Button } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { FiCornerUpRight } from 'react-icons/fi'

import CancelButton from '~/components/CancelButton'
import DefaultModal from '~/components/DefaultModal'
import { STORAGE_KEY } from '~/pages/SearchPageNew/utils/constants'

import type { ExportMetaPayload } from '~/api/search/export'
import { exportMeta, useFieldsCatalog } from '~/api/search/export'
import type { Position } from '~/hooks/use-scrolled'
import type {
  ExportFormatKey,
  ExportField,
  ExportStorage,
  LibraryExport
} from '~/types/library/library-export'
import { notifications } from '~/utils/notifications'
import { storage } from '~/utils/storage-utils'

import AvailableFieldsTitle from './components/AvailableFieldsTitle'
import ExportFormat from './components/ExportFormat'
import SelectableFieldsGroup from './components/SelectableFieldsGroup'
import SelectSection from './components/SelectSection'
import SortableFieldsGroup from './components/SortableFieldsGroup'
import SortedFieldsTitle from './components/SortedFieldsTitle'
import { EXPORT_FORMATS, EXPORT_PATHS_SEPARATOR } from './constants'
import useExportStorage from './hooks/use-export-storage'
import useSelectFields from './hooks/use-select-fields'
import * as S from './styles'
import updateSelectedStates from './utils/update-selected-states'

type Props = ModalProps & Partial<LibraryExport>

const exportStorage = storage<ExportStorage>(STORAGE_KEY.EXPORT)

const ExportModal = ({ reference, exportItems, opened, onClose, ...props }: Props) => {
  const [selectedFields, setSelectedFields] = useState<ExportField[]>([])
  const [sortedFields, sortedFieldsHandlers] = useListState<ExportField>([])
  const [format, setFormat] = useState<ExportFormatKey>('csv')

  const [isExporting, setIsExporting] = useState(false)

  // Keep track of whether the sorted fields are loading or not,
  // to prevent showing "No fields selected" before the data is loaded from the storage
  const [isSortedLoading, setIsSortedLoading] = useState(true)

  const { data, isLoading, error } = useFieldsCatalog({
    enabled: opened,
    onSuccess: values => {
      // Update the selected & sorted fields after loading the catalog
      updateSelectedStates({
        storage: exportStorage,
        exportFields: values.fields_catalog,
        setSelectedFields,
        setSortedFields: sortedFieldsHandlers.setState,
        setFormat
      })

      setIsSortedLoading(false)
    }
  })

  const exportFields = data?.fields_catalog ?? []

  const loading = isLoading || isSortedLoading || !data || !!error

  const { saveExportOptions } = useExportStorage({
    opened,
    exportFields,
    setSelectedFields,
    setSortedFields: sortedFieldsHandlers.setState,
    setFormat
  })

  const {
    handleSelectFields,
    handleSelectAllNone,
    handleUnselect,
    handleDragEnd,
    handleResetOrder
  } = useSelectFields({
    allFields: exportFields,
    selectedFields,
    setSelectedFields,
    sortedFields,
    sortedFieldsHandlers
  })

  const [scrollPosition, setScrollPosition] = useState<Position>()

  const selectedFormat = useMemo(
    () => EXPORT_FORMATS.find(({ value }) => value === format),
    [format]
  )

  if (!exportItems) {
    return null
  }

  const areFieldsSelected = selectedFields.length > 0

  const handleExport = async () => {
    saveExportOptions(sortedFields, format)

    setIsExporting(true)

    const ids: ExportMetaPayload['ids'] = exportItems.map(({ documentId, paths }) => ({
      id: documentId,
      // The same document can be located at multiple paths, so we join them here
      path: paths.join(EXPORT_PATHS_SEPARATOR)
    }))

    const fields: ExportMetaPayload['fields'] = sortedFields.map(({ name }) => name)

    const payload: ExportMetaPayload = {
      ids,
      fields,
      format
    }

    try {
      await exportMeta(payload, reference)

      notifications.showSuccess('Metadata exported successfully.')
      onClose()
    } catch (err) {
      notifications.showError('Something went wrong exporting the metadata.', {
        description: 'Please try again later.',
        autoClose: true
      })
    } finally {
      setIsExporting(false)
    }
  }

  const availableFieldsTitle = (
    <AvailableFieldsTitle
      areFieldsSelected={areFieldsSelected}
      loading={loading}
      onSelectAllNone={handleSelectAllNone}
    />
  )

  const sortedFieldsTitle = (
    <SortedFieldsTitle
      selectedFields={selectedFields}
      sortedFields={sortedFields}
      loading={loading}
      onResetOrder={handleResetOrder}
    />
  )

  const actions = (
    <Group spacing="sm">
      <CancelButton onClick={onClose} />

      <Button
        color="blue"
        loading={isExporting}
        disabled={loading || !areFieldsSelected}
        onClick={handleExport}
      >
        Export {selectedFormat?.label}
      </Button>
    </Group>
  )

  return (
    <DefaultModal
      opened={opened}
      title="Export metadata"
      icon={<FiCornerUpRight />}
      actions={actions}
      onClose={onClose}
      {...props}
      css={S.root}
    >
      <div css={S.content}>
        <div css={S.format}>
          <ExportFormat data={EXPORT_FORMATS} value={format} onChange={setFormat} />
        </div>

        <SelectSection title={availableFieldsTitle} loading={loading}>
          <SelectableFieldsGroup
            fields={exportFields}
            selected={selectedFields}
            onSelect={handleSelectFields}
          />
        </SelectSection>

        <SelectSection
          title={sortedFieldsTitle}
          loading={loading}
          onScrollPositionChange={setScrollPosition}
        >
          <SortableFieldsGroup
            fields={sortedFields}
            scrollOffset={scrollPosition?.y}
            onDragEnd={handleDragEnd}
            onUnselect={handleUnselect}
          />
        </SelectSection>
      </div>
    </DefaultModal>
  )
}

export default ExportModal
