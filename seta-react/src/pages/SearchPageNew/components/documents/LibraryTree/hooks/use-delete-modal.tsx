import { css } from '@emotion/react'
import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { FaRegTrashAlt } from 'react-icons/fa'

import ConfirmModal from '~/components/ConfirmModal'

import { useDeleteItem } from '~/api/search/library'
import useComplexModalState from '~/hooks/use-complex-modal-state'
import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'

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

  // TODO: Create helper functions for preset notifications settings
  const showErrorNotification = () => {
    notifications.show({
      title: `Unable to remove ${isFolder ? 'folder' : 'document'}`,
      message: (
        <div>
          Something went wrong {isFolder ? 'deleting the folder' : 'removing the document'}.
          <br /> Please try again later.
        </div>
      ),
      color: 'red',
      autoClose: false,
      styles: theme => ({
        root: {
          borderColor: theme.colors.gray[4]
        },
        title: {
          fontSize: theme.fontSizes.md
        }
      })
    })
  }

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
      },

      onError: () => {
        closeModal()
        showErrorNotification()
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
