import ExportModal from '~/pages/SearchPageNew/components/documents/ExportModal'
import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import useComplexModalState from '~/hooks/use-complex-modal-state'
import type { LibraryExport, LibraryItemExport } from '~/types/library/library-export'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'
import { getDocumentsForExport } from '~/utils/library-utils'

type Args = {
  withinPortal?: boolean
}

const useExportModal = (args?: Args) => {
  const { withinPortal = true } = args ?? {}

  const { open, openModal, closeModal, modalState } = useComplexModalState<LibraryExport>()

  const exportLibraryItem = (target: LibraryItem) => {
    const exportItems = getDocumentsForExport(target)

    // If the target is a folder, use its title as the reference, otherwise leave it undefined
    const reference = target.type === LibraryItemType.Folder ? target.title : undefined

    openModal({ reference, exportItems })
  }

  const exportStagedDocs = (docs: StagedDocument[]) => {
    const exportItems: LibraryItemExport[] = docs.map(({ id }) => ({ documentId: id, paths: [] }))

    // If there's only one document, use its title as the reference, otherwise leave it undefined
    const reference = docs.length === 1 ? docs[0].title : undefined

    openModal({ reference, exportItems })
  }

  const exportModal = (
    <ExportModal withinPortal={withinPortal} opened={open} {...modalState} onClose={closeModal} />
  )

  return {
    exportLibraryItem,
    exportStagedDocs,
    exportModal
  }
}

export default useExportModal
