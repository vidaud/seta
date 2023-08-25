import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { Group, TextInput, ActionIcon } from '@mantine/core'
import { FaPlus, FaCheck } from 'react-icons/fa'

import ActionIconPopover from '~/components/ActionIconPopover'

import * as S from './styles'

type Props = {
  isLoading?: boolean
  onPopoverChange?: (open: boolean) => void
  onNewFolder?: (name: string) => void
}

const NewFolderAction = ({ isLoading, onPopoverChange, onNewFolder }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const isValid = inputValue.trim().length > 0

  const submitNewFolder = () => {
    if (!isValid) {
      return
    }

    const value = inputValue.trim()

    setIsOpen(false)

    // Reset the input value after the popover closes
    setTimeout(() => {
      setInputValue('')
    }, 200)

    // TODO: Call the mutation here and remove the onNewFolder prop
    onNewFolder?.(value)
  }

  const handleSaveClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation()
    submitNewFolder()
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setInputValue(e.currentTarget.value)
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
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
