import { useEffect, useState } from 'react'
import type { ChangeEvent, Ref } from 'react'
import { Loader, ScrollArea, TextInput, rem } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'

import useScrolled from '~/hooks/use-scrolled'
import type { Label } from '~/types/search/annotations'

import LabelsSearchModal from './components/LabelsSearchModal'
import SelectedLabels from './components/SelectedLabels'
import * as S from './styles'

type Props = {
  selectedLabels: Label[]
  onSelectedChange: (labels: Label[]) => void

  inputRef?: Ref<HTMLInputElement>
}

const LabelsFilter = ({ selectedLabels, inputRef, onSelectedChange }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [typing, setTyping] = useState(false)

  const [inputValue, setInputValue] = useState('')
  const [searchValue] = useDebouncedValue(inputValue, 300)

  const { scrolled, handleScrollChange: handleSourceScrollChange } = useScrolled()

  useEffect(() => {
    if (searchValue) {
      setModalOpen(true)
      setTyping(false)
    }
  }, [searchValue])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)

    // Show the loader while typing for a better UX
    setTyping(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setInputValue('')
  }

  const handleRemoveLabels = (labels: Label[]) => {
    const newLabels = selectedLabels.filter(label => !labels.some(l => l.id === label.id))

    onSelectedChange(newLabels)
  }

  const typingLoader = typing && <Loader variant="dots" size="sm" />

  return (
    <div>
      <div css={S.searchContainer} data-scrolled={scrolled}>
        <TextInput
          ref={inputRef}
          value={inputValue}
          icon={<IconSearch size={20} />}
          iconWidth={32}
          placeholder="Type to find annotations"
          css={S.searchInput}
          rightSection={typingLoader}
          onChange={handleInputChange}
        />
      </div>

      <ScrollArea.Autosize
        mx="auto"
        mah={rem(250)}
        onScrollPositionChange={handleSourceScrollChange}
      >
        <SelectedLabels labels={selectedLabels} onRemoveLabels={handleRemoveLabels} />
      </ScrollArea.Autosize>

      <LabelsSearchModal
        opened={modalOpen}
        searchValue={searchValue}
        selectedLabels={selectedLabels}
        onClose={handleModalClose}
        onSelectedChange={onSelectedChange}
      />
    </div>
  )
}

export default LabelsFilter
