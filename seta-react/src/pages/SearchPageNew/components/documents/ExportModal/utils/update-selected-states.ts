import type { Dispatch, SetStateAction } from 'react'

import type { ExportField, ExportFormatKey, ExportStorage } from '~/types/library/library-export'
import type { StorageOperations } from '~/utils/storage-utils'

type Args = {
  storage: StorageOperations<ExportStorage>
  exportFields: ExportField[]
  setSelectedFields: Dispatch<SetStateAction<ExportField[]>>
  setSortedFields: Dispatch<SetStateAction<ExportField[]>>
  setFormat: Dispatch<SetStateAction<ExportFormatKey>>
}

const updateSelectedStates = ({
  storage,
  exportFields,
  setSelectedFields,
  setSortedFields,
  setFormat
}: Args) => {
  const storageValue = storage.read()

  if (!storageValue) {
    setSelectedFields([])
    setSortedFields([])

    return
  }

  const { fieldsNames, format } = storageValue

  // Use the export fields that are in the storage, ignore those that are not available anymore
  const filteredFields = fieldsNames.reduce<ExportField[]>((acc, name) => {
    const field = exportFields.find(f => f.name === name)

    if (field) {
      acc.push(field)
    }

    return acc
  }, [])

  setSelectedFields(filteredFields)
  setSortedFields(filteredFields)
  setFormat(format)
}

export default updateSelectedStates
