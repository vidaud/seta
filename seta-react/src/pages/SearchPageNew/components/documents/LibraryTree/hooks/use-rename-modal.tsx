import { useEffect, useMemo, useState } from 'react'
import { css } from '@emotion/react'
import { Text } from '@mantine/core'

import PromptModal from '~/components/PromptModal'

import { useUpdateItem } from '~/api/search/library'
import useComplexModalState from '~/hooks/use-complex-modal-state'
import type { LibraryItem } from '~/types/library/library-item'
import { notifications } from '~/utils/notifications'

import { getFolderPath } from '../utils'

const pathContainerStyle: ThemedCSS = theme => css`
  color: ${theme.colors.teal[8]};
  font-size: ${theme.fontSizes.sm};
  display: flex;
  align-items: center;

  & > div {
    & + div {
      &::before {
        content: '/';
        margin: 0 4px;
      }
    }

    &:last-of-type {
      font-weight: 500;

      &::before {
        font-weight: normal;
      }
    }
  }
`

const useRenameModal = () => {
  const {
    open,
    openModal,
    closeModal,
    modalState: folder
  } = useComplexModalState<LibraryItem>(undefined)

  const [hasError, setHasError] = useState(false)

  const { mutate, isLoading } = useUpdateItem()

  // Reset the error state when closing the modal
  useEffect(() => {
    if (!open) {
      setHasError(false)
    }
  }, [open])

  const renameFolder = (target: LibraryItem) => {
    openModal(target)
  }

  const handleSubmit = (name: string) => {
    if (!folder) {
      return
    }

    setHasError(false)

    mutate(
      { ...folder, title: name.trim() },
      {
        onSuccess: () => {
          closeModal()
          notifications.showSuccess(`The folder was renamed successfully.`)
        },

        onError: () => {
          setHasError(true)
        }
      }
    )
  }

  const path = useMemo(() => getFolderPath(folder), [folder])

  const label = (
    <Text size="md" color="dark" mb="xs">
      Enter a new name for:
      <div css={pathContainerStyle}>{path}</div>
    </Text>
  )

  const error = hasError ? `There was an error renaming '${folder?.title}'.` : undefined

  const renameModal = (
    <PromptModal
      opened={open}
      label={label}
      loading={isLoading}
      error={error}
      placeholder="Folder name"
      submitLabel="Rename folder"
      initialValue={folder?.title ?? ''}
      onClose={closeModal}
      onSubmit={handleSubmit}
    />
  )

  return {
    renameFolder,
    renameModal
  }
}

export default useRenameModal
