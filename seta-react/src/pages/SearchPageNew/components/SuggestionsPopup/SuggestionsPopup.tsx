import { useEffect, useRef, useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/contexts/search-input-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'
import TermsSuggestions from '../TermsSuggestions'

type Props = {
  opened?: boolean
  onOpenChange?: PopoverProps['onChange']
}

const TOKEN_RESET_DELAY = 100

const SuggestionsPopup = ({ opened, onOpenChange }: Props) => {
  const [popupOpen, setPopupOpen] = useState(opened ?? false)
  const [termsView, setTermsView] = useState(TermsView.TermsClusters)
  const [enrichQuery, setEnrichQuery] = useState(false)

  const { setCurrentToken, onSearch } = useSearch()
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

  const handleEnrichToggle = () => {
    setEnrichQuery(value => !value)
  }

  const handleSearch = () => {
    closePopup()
    onSearch()
  }

  return (
    <Popover
      opened={popupOpen}
      onChange={handlePopupChange}
      width="target"
      withArrow
      arrowSize={12}
      shadow="sm"
      offset={6}
    >
      <Popover.Target>
        <SearchInput
          css={S.inputWrapper}
          value={inputValue}
          onClick={handleInputClick}
          onDeferredChange={handleInputChange}
          onSearch={handleSearch}
        />
      </Popover.Target>

      <Popover.Dropdown css={S.popup} className="flex">
        <AutocompleteSuggestions css={S.popupLeft} />
        <Divider orientation="vertical" />

        <TermsSuggestions
          css={S.popupRight}
          currentView={termsView}
          enrichQuery={enrichQuery}
          onViewChange={setTermsView}
          onEnrichToggle={handleEnrichToggle}
        />

        <ActionIcon variant="light" size="lg" radius="sm" css={S.closeButton} onClick={closePopup}>
          <IconX size={20} strokeWidth={3} />
        </ActionIcon>
      </Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
