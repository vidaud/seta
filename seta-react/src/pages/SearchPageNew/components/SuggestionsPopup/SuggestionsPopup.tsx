import { useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { SearchProvider } from './contexts/search-context'
import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'
import TermClusters from '../TermClusters'

type Props = {
  opened?: boolean
  onOpenChange?: PopoverProps['onChange']
}

const SuggestionsPopup = ({ opened, onOpenChange }: Props) => {
  const [popupOpen, setPopupOpen] = useState(opened ?? false)
  const [inputValue, setInputValue] = useState('')

  const handlePopupChange = (value: boolean) => {
    setPopupOpen(value)
    onOpenChange?.(value)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)

    handlePopupChange(true)
  }

  const openPopup = () => handlePopupChange(true)
  const closePopup = () => handlePopupChange(false)

  const handleSuggestionSelected = (suggestion: string) => {
    const value = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    setInputValue(current => `${current} ${value}`)
  }

  return (
    <SearchProvider onSuggestionSelected={handleSuggestionSelected}>
      <Popover
        opened={popupOpen}
        onChange={handlePopupChange}
        width="target"
        withArrow
        arrowSize={12}
        shadow="sm"
        offset={-2}
        returnFocus
      >
        <Popover.Target>
          <SearchInput
            css={S.inputWrapper}
            value={inputValue}
            onClick={openPopup}
            onChange={handleInputChange}
          />
        </Popover.Target>

        <Popover.Dropdown css={S.popup} className="flex">
          <AutocompleteSuggestions css={S.popupLeft} />
          <Divider orientation="vertical" />
          <TermClusters css={S.popupRight} />

          <ActionIcon
            variant="light"
            size="lg"
            radius="sm"
            css={S.closeButton}
            onClick={closePopup}
          >
            <IconX size={20} strokeWidth={3} />
          </ActionIcon>
        </Popover.Dropdown>
      </Popover>
    </SearchProvider>
  )
}

export default SuggestionsPopup
