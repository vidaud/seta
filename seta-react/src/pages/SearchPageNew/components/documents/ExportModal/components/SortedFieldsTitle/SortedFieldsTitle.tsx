import { useMemo } from 'react'
import { IconArrowBackUp } from '@tabler/icons-react'

import ActionLink from '~/components/ActionLink'

import type { ExportField } from '~/types/library/library-export'

import SelectSectionTitle from '../SelectSectionTitle'

type Props = {
  selectedFields: ExportField[]
  sortedFields: ExportField[]
  loading?: boolean
  onResetOrder: () => void
}

const SortedFieldsTitle = ({ selectedFields, sortedFields, loading, onResetOrder }: Props) => {
  const areFieldsSelected = selectedFields.length > 0

  const isOrderChanged = useMemo(
    () =>
      sortedFields.length > 0 &&
      sortedFields.map(({ name }) => name).join() !== selectedFields.map(({ name }) => name).join(),
    [selectedFields, sortedFields]
  )

  const tooltip =
    loading || !areFieldsSelected
      ? undefined
      : 'Drag and drop to set the order of the exported fields'

  return (
    <SelectSectionTitle title="Fields to export" tooltip={tooltip}>
      {isOrderChanged && (
        <ActionLink leftIcon={<IconArrowBackUp />} onClick={onResetOrder}>
          Reset order
        </ActionLink>
      )}
    </SelectSectionTitle>
  )
}

export default SortedFieldsTitle
