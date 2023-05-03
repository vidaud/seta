import { useEffect, useRef, useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'
import TermClusters from '~/pages/SearchPageNew/components/TermClusters'

import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'

type Props = {
  opened?: boolean
  onOpenChange?: PopoverProps['onChange']
}

const TOKEN_RESET_DELAY = 100

const SuggestionsPopup = ({ opened, onOpenChange }: Props) => {
  const { setCurrentToken } = useSearch()
  const { inputValue, setInputValue } = useSearchInput()

  // const [inputValue, setInputValue] = useState('')
  const [popupOpen, setPopupOpen] = useState(opened ?? false)

  const closingTimeoutRef = useRef<number | null>(null)

  // Delay the token reset to avoid it disappearing before the animation ends when the popup is closing
  useEffect(() => {
    if (!popupOpen) {
      closingTimeoutRef.current = setTimeout(() => {
        setCurrentToken(null)
      }, TOKEN_RESET_DELAY)
    }

    return () => {
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current)
      }
    }
  }, [popupOpen, setCurrentToken])

  const handlePopupChange = (value: boolean) => {
    setPopupOpen(value)
    onOpenChange?.(value)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    handlePopupChange(true)
  }

  const handleInputBlur = () => {
    setInputValue(inputValue.replace(/\s+/g, ' ').trim())
  }

  const openPopup = () => handlePopupChange(true)
  const closePopup = () => handlePopupChange(false)

  return (
    <Popover
      opened={popupOpen}
      onChange={handlePopupChange}
      width="target"
      withArrow
      arrowSize={12}
      shadow="sm"
      offset={-2}
      // withinPortal
    >
      <Popover.Target>
        <SearchInput
          css={S.inputWrapper}
          value={inputValue}
          onClick={openPopup}
          onDeferredChange={handleInputChange}
        />
      </Popover.Target>

      <Popover.Dropdown css={S.popup} className="flex">
        <AutocompleteSuggestions css={S.popupLeft} />
        <Divider orientation="vertical" />
        <TermClusters css={S.popupRight} />

        <ActionIcon variant="light" size="lg" radius="sm" css={S.closeButton} onClick={closePopup}>
          <IconX size={20} strokeWidth={3} />
        </ActionIcon>
      </Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
