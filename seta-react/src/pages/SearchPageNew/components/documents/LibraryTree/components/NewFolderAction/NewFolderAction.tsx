import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { Group, TextInput, ActionIcon } from '@mantine/core'
import { FaPlus, FaCheck } from 'react-icons/fa'

import ActionIconPopover from '~/components/ActionIconPopover'
import { ROOT_NODE_ID } from '~/pages/SearchPageNew/components/documents/LibraryTree/constants'

import { useCreateNewFolder } from '~/api/search/library'
import type { LibraryItem } from '~/types/library/library-item'
import { INVALID_PATH_CHARACTERS } from '~/utils/library-utils'

import * as S from './styles'

type Props = {
  parent: LibraryItem
  onPopoverChange?: (open: boolean) => void
  onCreatingNewFolder?: () => void
  onNewFolderCreated?: (folderId: string) => void
}

const NewFolderAction = ({
  parent,
  onPopoverChange,
  onCreatingNewFolder,
  onNewFolderCreated
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { mutateAsync: createNewFolderAsync } = useCreateNewFolder()

  const isValid = inputValue.trim().length > 0

  const createNewFolder = async () => {
    onCreatingNewFolder?.()
    setIsLoading(true)

    const parentId = parent.id === ROOT_NODE_ID ? null : parent.id

    // Destructure the first item from the array
    const [item] = await createNewFolderAsync({ parentId, title: inputValue.trim() })

    setIsLoading(false)
    onNewFolderCreated?.(item.id)
  }

  const submitNewFolder = () => {
    if (!isValid) {
      return
    }

    setIsOpen(false)

    // Reset the input value after the popover closes
    setTimeout(() => {
      setInputValue('')
    }, 200)

    createNewFolder()
  }

  const handleSaveClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation()
    submitNewFolder()
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setInputValue(e.currentTarget.value)
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (INVALID_PATH_CHARACTERS.includes(e.key)) {
      e.preventDefault()

      return
    }

    if (e.key === 'Enter') {
      submitNewFolder()
    }
  }

  return (
    <ActionIconPopover
      action={{
        icon: <FaPlus size={18} />,
        color: 'teal',
        loading: isLoading,
        active: isLoading,
        tooltip: 'New folder',
        onClick: () => setIsOpen(true)
      }}
      shadow="xs"
      css={S.popover}
      opened={isOpen}
      onChange={setIsOpen}
      onOpen={() => onPopoverChange?.(true)}
      onClose={() => onPopoverChange?.(false)}
    >
      <Group>
        <TextInput
          placeholder="New folder"
          size="md"
          color="teal"
          css={S.input}
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />

        <ActionIcon
          css={S.saveButton}
          color="teal"
          variant="light"
          disabled={!isValid}
          onClick={handleSaveClick}
        >
          <FaCheck size={18} />
        </ActionIcon>
      </Group>
    </ActionIconPopover>
  )
}

export default NewFolderAction
