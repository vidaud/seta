import { css } from '@emotion/react'
import { Text } from '@mantine/core'
import { FaRegTrashAlt } from 'react-icons/fa'

import ConfirmModal from '~/components/ConfirmModal'

import { useDeleteItem } from '~/api/search/library'
import useComplexModalState from '~/hooks/use-complex-modal-state'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'
import { notifications } from '~/utils/notifications'

const removeIconStyle: ThemedCSS = theme => css`
  color: ${theme.colors.red[5]};
  font-size: 3.2rem;
`

const useDeleteModal = () => {
  const {
    open,
    openModal,
    closeModal,
    modalState: item
  } = useComplexModalState<LibraryItem>(undefined)

  const { mutate, isLoading } = useDeleteItem()

  const { id, title, type } = item ?? {}

  const isFolder = type === LibraryItemType.Folder

  const confirmDelete = (target: LibraryItem) => {
    openModal(target)
  }

  const handleConfirm = () => {
    if (!id) {
      return
    }

    mutate(id, {
      onSuccess: () => {
        closeModal()

        notifications.showInfo(
          `The ${isFolder ? 'folder was deleted' : 'document was removed'} from your library.`,
          { description: !isFolder ? 'You can add it back from the search results.' : undefined }
        )
      },

      onError: () => {
        closeModal()

        notifications.showError(
          `Something went wrong ${isFolder ? 'deleting the folder' : 'removing the document'}.`,
          { description: 'Please try again later.' }
        )
      }
    })
  }

  const operation = isFolder ? 'delete the folder' : 'remove the document'
  const label = isFolder ? 'Delete folder' : 'Remove document'

  const secondary = isFolder
    ? 'Everything inside this folder will also be removed from your Library.'
    : 'You can add it back later from the search results.'

  const description = (
    <Text size="lg" color="dark.6" maw="32rem">
      Are you sure you want to {operation} '
      <Text weight={500} className="inline">
        {title}
      </Text>
      '?
    </Text>
  )

  const confirmDeleteModal = (
    <ConfirmModal
      icon={<FaRegTrashAlt css={removeIconStyle} />}
      description={description}
      secondary={secondary}
      confirmLabel={label}
      confirmColor="red"
      opened={open}
      loading={isLoading}
      onClose={closeModal}
      onConfirm={handleConfirm}
    />
  )

  return {
    confirmDelete,
    confirmDeleteModal
  }
}

export default useDeleteModal
