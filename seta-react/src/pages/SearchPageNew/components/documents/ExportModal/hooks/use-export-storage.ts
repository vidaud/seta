import type { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'

import updateSelectedStates from '~/pages/SearchPageNew/components/documents/ExportModal/utils/update-selected-states'
import { STORAGE_KEY } from '~/pages/SearchPageNew/utils/constants'

import type { ExportField, ExportFormatKey, ExportStorage } from '~/types/library/library-export'
import { storage } from '~/utils/storage-utils'

const exportStorage = storage<ExportStorage>(STORAGE_KEY.EXPORT)

type Args = {
  opened: boolean
  exportFields: ExportField[]
  setSelectedFields: Dispatch<SetStateAction<ExportField[]>>
  setSortedFields: Dispatch<SetStateAction<ExportField[]>>
  setFormat: Dispatch<SetStateAction<ExportFormatKey>>
}

const useExportStorage = ({
  opened,
  exportFields,
  setSelectedFields,
  setSortedFields,
  setFormat
}: Args) => {
  useEffect(() => {
    updateStates()
    // We only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (opened) {
      return
    }

    // Wait for the modal to close before updating the states
    setTimeout(() => {
      updateStates()
    }, 300)

    // We only want to run this effect when `opened` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  const updateStates = () => {
    updateSelectedStates({
      storage: exportStorage,
      exportFields,
      setSelectedFields,
      setSortedFields,
      setFormat
    })
  }

  const saveExportOptions = (sortedFields: ExportField[], format: ExportFormatKey) => {
    const fieldsNames = sortedFields.map(field => field.name)

    exportStorage.write({ fieldsNames, format })
  }

  return { saveExportOptions }
}

export default useExportStorage
