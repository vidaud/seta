import ExportModal from '~/pages/SearchPageNew/components/documents/ExportModal'

import useComplexModalState from '~/hooks/use-complex-modal-state'
import type { LibraryExport } from '~/types/library/library-export'
import type { LibraryItem } from '~/types/library/library-item'
import { getDocumentsForExport } from '~/utils/library-utils'

const useExportModal = () => {
  const { open, openModal, closeModal, modalState } = useComplexModalState<LibraryExport>()

  const exportItem = (target: LibraryItem) => {
    const exportItems = getDocumentsForExport(target)

    openModal({
      exportTarget: target,
      exportItems
    })
  }

  const exportModal = <ExportModal opened={open} {...modalState} onClose={closeModal} />

  return {
    exportItem,
    exportModal
  }
}

export default useExportModal
