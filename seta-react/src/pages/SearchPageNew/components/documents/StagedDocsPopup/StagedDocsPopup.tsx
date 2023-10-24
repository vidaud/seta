import { type ReactElement } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ScrollArea, Stack } from '@mantine/core'

import PopupOverlay from '~/components/PopupOverlay'
import useExportModal from '~/pages/SearchPageNew/components/documents/LibraryTree/hooks/use-export-modal'
import { useStagedDocuments } from '~/pages/SearchPageNew/contexts/staged-documents-context'
import useSaveDocsModal from '~/pages/SearchPageNew/hooks/use-save-docs-modal'

import useScrolled from '~/hooks/use-scrolled'
import { CONTENT_MAX_WIDTH } from '~/styles'

import StagedActions from './components/StagedActions'
import StagedDocInfo from './components/StagedDocInfo'
import useRemoveDocsModal from './hooks/use-remove-docs-modal'
import useSelectedDocs from './hooks/use-selected-docs'
import * as S from './styles'

type Props = {
  target: ReactElement
  open?: boolean
  onOpenChange?: (value: boolean) => void
}

const StagedDocsPopup = ({ target, open, onOpenChange }: Props) => {
  const { scrolled, setScrolled, handleScrollChange } = useScrolled({ delta: 10 })
  const { stagedDocuments, removeStaged, clearStaged } = useStagedDocuments()

  const {
    selectedDocs,
    clearSelectedDocs,
    isSelected,
    toggleSelected,
    handleSelectAll,
    handleSelectNone,
    selectNoneDelayed
  } = useSelectedDocs(stagedDocuments)

  const { handleRemoveOne, handleRemoveSelected, handleRemoveAll, confirmRemoveModal } =
    useRemoveDocsModal({
      selectedDocs,
      clearSelectedDocs,
      toggleSelected,
      removeStaged,
      clearStaged
    })

  const { handleSave, saveModal } = useSaveDocsModal({
    selectedDocs,
    clearSelectedDocs,
    removeStaged
  })

  const { exportStagedDocs, exportModal } = useExportModal({ withinPortal: false })

  const [animateRef] = useAutoAnimate<HTMLDivElement>({ duration: 200 })

  const actionsStyle = [S.actions, scrolled && S.withShadow]

  // If the popup is open, but there are no staged documents, close it
  const internalOpen = !!stagedDocuments.length && open

  const handlePopupClose = () => {
    selectNoneDelayed()
    setScrolled(false)
  }

  const documents = (
    <ScrollArea css={S.scrollArea} onScrollPositionChange={handleScrollChange}>
      <div ref={animateRef} css={S.docs}>
        {stagedDocuments.map(doc => (
          <StagedDocInfo
            key={doc.id}
            document={doc}
            selected={isSelected(doc)}
            onSelectChange={selected => toggleSelected(selected, doc)}
            onRemove={() => handleRemoveOne(doc)}
          />
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <>
      <PopupOverlay
        target={target}
        open={internalOpen}
        width={CONTENT_MAX_WIDTH}
        position="bottom-end"
        shadow="lg"
        offset={-34}
        onOpenChange={onOpenChange}
        onClose={handlePopupClose}
      >
        <Stack px="xs" spacing={0} mah="100%" className="flex-1">
          <StagedActions
            css={actionsStyle}
            stagedCount={stagedDocuments.length}
            selectedCount={selectedDocs.length}
            onSelectAll={handleSelectAll}
            onSelectNone={handleSelectNone}
            onRemoveAll={handleRemoveAll}
            onRemoveSelected={handleRemoveSelected}
            onSaveSelected={handleSave}
            onExportSelected={() => exportStagedDocs(selectedDocs)}
            onExportAll={() => exportStagedDocs(stagedDocuments)}
          />

          {documents}
        </Stack>

        {confirmRemoveModal}
        {saveModal}
        {exportModal}
      </PopupOverlay>
    </>
  )
}

export default StagedDocsPopup
