import { useEffect, useRef, useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/contexts/search-input-context'
import type { EnrichedStatus } from '~/pages/SearchPageNew/types/search'
import { EnrichType } from '~/pages/SearchPageNew/types/search'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'
import TermsSuggestions from '../TermsSuggestions'

type Props = {
  opened?: boolean
  enrichQuery?: boolean
  onOpenChange?: PopoverProps['onChange']
  onEnrichToggle?: (status: EnrichedStatus) => void
}

const TOKEN_RESET_DELAY = 100

const SuggestionsPopup = ({ opened, enrichQuery, onOpenChange, onEnrichToggle }: Props) => {
  const [popupOpen, setPopupOpen] = useState(opened ?? false)
  const [termsView, setTermsView] = useState(TermsView.TermsClusters)

  const { setCurrentToken, onSearch } = useSearch()
  const { inputValue, setInputValue } = useSearchInput()

  const closingTimeoutRef = useRef<number | null>(null)

  const enrichType =
    termsView === TermsView.TermsClusters ? EnrichType.Ontology : EnrichType.Similar

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

  // Retrigger the event when the view changes
  useEffect(() => {
    if (enrichQuery) {
      onEnrichToggle?.({
        enriched: true,
        type: enrichType
      })
    }
  }, [enrichType, enrichQuery, onEnrichToggle])

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
    onEnrichToggle?.({
      enriched: !enrichQuery,
      type: enrichType
    })
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
