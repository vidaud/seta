import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button, Group, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconTag } from '@tabler/icons-react'

import CancelButton from '~/components/CancelButton'
import ClearButton from '~/components/ClearButton'
import DefaultModal from '~/components/DefaultModal'

import { useAnnotations } from '~/api/catalogues/annotations'
import type { ModalStateProps } from '~/types/lib-props'
import type { Label } from '~/types/search/annotations'

import LabelsModalContent from './components/LabelsModalContent'
import * as S from './styles'

type Props = {
  searchValue: string
  selectedLabels: Label[]
  onSelectedChange: (labels: Label[]) => void
} & ModalStateProps

const LabelsSearchModal = ({
  searchValue,
  selectedLabels,
  onSelectedChange,
  opened,
  onClose,
  ...modalProps
}: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [internalSelected, setInternalSelected] = useState<Label[]>([])

  const [internalSearchValue] = useDebouncedValue(inputValue, 200)

  const { data, isLoading, isFetching, error, refetch } = useAnnotations({ enabled: opened })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (opened) {
      // Sync the internal input value and the selected labels
      setInputValue(searchValue)
      setInternalSelected(selectedLabels)
    }
  }, [opened, searchValue, selectedLabels])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleClearInput = () => {
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleApply = () => {
    onSelectedChange(internalSelected)
    onClose()
  }

  const actions = (
    <Group spacing="sm">
      <CancelButton onClick={onClose} />

      <Button color="teal" disabled={isLoading || !!error} onClick={handleApply}>
        Confirm Selection ({internalSelected.length})
      </Button>
    </Group>
  )

  return (
    <DefaultModal
      opened={opened}
      title="Select annotations"
      icon={<IconTag />}
      actions={actions}
      css={S.root}
      transitionProps={{
        // The transition doesn't run if the duration is 0
        duration: 1,
        exitDuration: 200,
        onExited: () => setInputValue('')
      }}
      onClose={onClose}
      {...modalProps}
    >
      <div css={S.content}>
        <TextInput
          ref={inputRef}
          value={inputValue}
          icon={<IconSearch size={20} />}
          iconWidth={32}
          placeholder="Type to find annotations"
          aria-label="Type to find annotations"
          rightSection={<ClearButton onClick={handleClearInput} />}
          data-autofocus
          onChange={handleInputChange}
        />

        <LabelsModalContent
          data={data}
          searchValue={internalSearchValue}
          isLoading={isLoading || isFetching}
          error={error}
          selectedLabels={internalSelected}
          isModalOpen={opened}
          onSelectedChange={setInternalSelected}
          onRefetch={refetch}
        />
      </div>
    </DefaultModal>
  )
}

export default LabelsSearchModal
