import type { KeyboardEvent } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Button, Flex, Tooltip } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { useEnrichLoading } from '~/pages/SearchPageNew/contexts/enrich-loading-context'

import useIsMounted from '~/hooks/use-is-mounted'

import * as S from './styles'
import UploadButton from './UploadButton'

import TokensInput from '../TokensInput'

type Props = {
  className?: string
  value?: string
  allowSearching?: boolean
  enrichQuery?: boolean
  highlightUploadButton?: boolean
  onDeferredChange?: (value: string) => void
  onClick?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onSearch?: () => void
  onUploadClick?: () => void
}

const SearchInput = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      value,
      allowSearching,
      enrichQuery,
      highlightUploadButton,
      onDeferredChange,
      onClick,
      onKeyDown,
      onSearch,
      onUploadClick
    },
    ref
  ) => {
    const [inputFocused, setInputFocused] = useState(false)

    const isMounted = useIsMounted()
    const wasMountedHandled = useRef(false)

    const { loading } = useEnrichLoading()

    useEffect(() => {
      let timeout: number | null = null

      if (isMounted()) {
        // After a short delay, we ignore subsequent calls to onSearch
        // to prevent it from triggering when allowSearching changes based on user interaction
        timeout = setTimeout(() => {
          if (allowSearching && !wasMountedHandled.current) {
            onSearch?.()
          }

          wasMountedHandled.current = true
        }, 200)
      }

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }, [isMounted, onSearch, allowSearching])

    return (
      <Flex ref={ref} className={className} id="search-query">
        <UploadButton
          active={highlightUploadButton}
          inputFocused={inputFocused}
          onClick={onUploadClick}
        />

        <TokensInput
          className="flex-1"
          css={S.input}
          size="md"
          placeholder="Start typing a search term"
          value={value}
          enrichQuery={enrichQuery}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onChange={onDeferredChange}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />

        <Tooltip
          label="Type a keyword or attach a document to enable searching"
          multiline
          width={300}
          disabled={allowSearching}
        >
          <div css={S.searchButtonWrapper} data-disabled={!allowSearching}>
            <Button
              css={S.searchButton}
              size="md"
              leftIcon={<IconSearch />}
              onClick={onSearch}
              disabled={!allowSearching}
              loading={loading}
            >
              Search
            </Button>
          </div>
        </Tooltip>
      </Flex>
    )
  }
)

export default SearchInput
