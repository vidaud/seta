import type { KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/contexts/search-input-context'
import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'
import type { EnrichedStatus } from '~/pages/SearchPageNew/types/search'
import { EnrichType } from '~/pages/SearchPageNew/types/search'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

import AutocompleteSuggestions from '../AutocompleteSuggestions'
import SearchInput from '../SearchInput'
import TermsSuggestions from '../TermsSuggestions'
import UploadContainer from '../upload/UploadContainer'

enum PopupTarget {
  Input = 'input',
  Upload = 'upload'
}

type Props = {
  opened?: boolean
  enrichQuery?: boolean
  onOpenChange?: PopoverProps['onChange']
  onEnrichToggle?: (status: EnrichedStatus) => void
}

const TOKEN_RESET_DELAY = 100

const SuggestionsPopup = ({ opened, enrichQuery, onOpenChange, onEnrichToggle }: Props) => {
  const [popupOpen, setPopupOpen] = useState(opened ?? false)
  const [popupTarget, setPopupTarget] = useState<PopupTarget | null>(null)

  const [termsView, setTermsView] = useState(TermsView.TermsClusters)

  const { setCurrentToken, onSearch } = useSearch()
  const { inputValue, setInputValue } = useSearchInput()
  const { documents } = useUploadDocuments()

  const closingTimeoutRef = useRef<number | null>(null)

  const enrichType =
    termsView === TermsView.TermsClusters ? EnrichType.Ontology : EnrichType.Similar

  const allowSearching = true //(inputValue?.trim().length ?? 0) > 1 || !!documents.length

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

  const highlightUploadButton = popupOpen && popupTarget === PopupTarget.Upload

  const handlePopupChange = (value: boolean) => {
    setPopupOpen(value)
    onOpenChange?.(value)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    handlePopupChange(true)
  }

  const openPopup = (target: PopupTarget) => {
    setPopupTarget(target)
    handlePopupChange(true)
  }

  const closePopup = () => {
    handlePopupChange(false)

    // Delay resetting the popup target to avoid it switching before the animation ends
    setTimeout(() => {
      setPopupTarget(null)
    }, 150)
  }

  const handleInputClick = () => {
    if (inputValue) {
      openPopup(PopupTarget.Input)
    } else {
      closePopup()
    }
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Tab') {
      openPopup(PopupTarget.Input)
    }
  }

  const handleUploadClick = () => {
    if (popupOpen && popupTarget === PopupTarget.Upload) {
      closePopup()
    } else {
      openPopup(PopupTarget.Upload)
      setCurrentToken(null)
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
    onSearch(documents)
  }

  const popupContent =
    popupTarget === PopupTarget.Upload ? (
      <UploadContainer />
    ) : (
      <>
        <AutocompleteSuggestions css={S.popupLeft} />

        <Divider orientation="vertical" />

        <TermsSuggestions
          css={S.popupRight}
          currentView={termsView}
          enrichQuery={enrichQuery}
          onViewChange={setTermsView}
          onEnrichToggle={handleEnrichToggle}
        />
      </>
    )

  return (
    <Popover
      opened={popupOpen}
      onChange={handlePopupChange}
      width="target"
      withArrow
      arrowSize={16}
      shadow="sm"
      offset={10}
    >
      <Popover.Target>
        <SearchInput
          css={S.inputWrapper}
          value={inputValue}
          allowSearching={allowSearching}
          enrichQuery={enrichQuery}
          highlightUploadButton={highlightUploadButton}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          onDeferredChange={handleInputChange}
          onSearch={handleSearch}
          onUploadClick={handleUploadClick}
        />
      </Popover.Target>

      <Popover.Dropdown css={S.popup} className="flex" data-target={popupTarget}>
        {popupContent}

        <ActionIcon variant="light" size="md" radius="sm" css={S.closeButton} onClick={closePopup}>
          <IconX size={20} strokeWidth={3} />
        </ActionIcon>
      </Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
