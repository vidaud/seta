import { useEffect, useRef, useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'
import TermsSuggestions from '~/pages/SearchPageNew/components/TermsSuggestions/TermsSuggestions'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'

type Props = {
  opened?: boolean
  onOpenChange?: PopoverProps['onChange']
}

const TOKEN_RESET_DELAY = 100

const SuggestionsPopup = ({ opened, onOpenChange }: Props) => {
  const [popupOpen, setPopupOpen] = useState(opened ?? false)
  const [termsView, setTermsView] = useState(TermsView.RelatedTerms)

  const { setCurrentToken } = useSearch()
  const { inputValue, setInputValue } = useSearchInput()

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

  useEffect(() => {
    if (!inputValue.trim()) {
      setPopupOpen(false)
    }
  }, [inputValue])

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

  const handleInputClick = () => {
    if (inputValue) {
      openPopup()
    }
  }

  return (
    <Popover
      opened={popupOpen}
      onChange={handlePopupChange}
      width="target"
      withArrow
      arrowSize={12}
      shadow="sm"
      offset={-2}
    >
      <Popover.Target>
        <SearchInput
          css={S.inputWrapper}
          value={inputValue}
          onClick={handleInputClick}
          onDeferredChange={handleInputChange}
        />
      </Popover.Target>

      <Popover.Dropdown css={S.popup} className="flex">
        <AutocompleteSuggestions css={S.popupLeft} />
        <Divider orientation="vertical" />
        <TermsSuggestions css={S.popupRight} currentView={termsView} onViewChange={setTermsView} />

        <ActionIcon variant="light" size="lg" radius="sm" css={S.closeButton} onClick={closePopup}>
          <IconX size={20} strokeWidth={3} />
        </ActionIcon>
      </Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
