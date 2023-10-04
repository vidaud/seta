import type { Dispatch, SetStateAction } from 'react'
import type { OnDragEndResponder } from '@hello-pangea/dnd'
import type { UseListStateHandlers } from '@mantine/hooks'

import type { ExportField } from '~/types/library/library-export'

type Args = {
  allFields: ExportField[]
  selectedFields: ExportField[]
  setSelectedFields: Dispatch<SetStateAction<ExportField[]>>
  sortedFields: ExportField[]
  sortedFieldsHandlers: UseListStateHandlers<ExportField>
}

const useSelectFields = ({
  allFields,
  selectedFields,
  setSelectedFields,
  sortedFields,
  sortedFieldsHandlers
}: Args) => {
  const areFieldsSelected = selectedFields.length > 0

  const handleSelectFields = (fields: ExportField[]) => {
    setSelectedFields(fields)

    // Add new fields to the end of the list to preserve the order of the already sorted fields
    // Remove fields that are not selected anymore

    const toAdd = fields.filter(field => !sortedFields.includes(field))
    const toRemove = sortedFields.filter(field => !fields.includes(field))

    sortedFieldsHandlers.setState(
      [...sortedFields, ...toAdd].filter(field => !toRemove.includes(field))
    )
  }

  const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
    sortedFieldsHandlers.reorder({ from: source.index, to: destination?.index ?? 0 })
  }

  const handleUnselect = (field: ExportField) => {
    const selectedFieldsNew = selectedFields.filter(({ name }) => name !== field.name)

    const sortedFieldsNew = sortedFields.filter(({ name }) => name !== field.name)

    setSelectedFields(selectedFieldsNew)
    sortedFieldsHandlers.setState(sortedFieldsNew)
  }

  const handleSelectAllNone = () => {
    const fields: ExportField[] = areFieldsSelected ? [] : allFields

    setSelectedFields(fields)
    sortedFieldsHandlers.setState(fields)
  }

  const handleResetOrder = () => {
    sortedFieldsHandlers.setState(selectedFields)
  }

  return {
    handleSelectFields,
    handleSelectAllNone,
    handleUnselect,
    handleResetOrder,
    handleDragEnd
  }
}

export default useSelectFields
