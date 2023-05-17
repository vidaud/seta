import { forwardRef } from 'react'
import { ActionIcon, Button, Flex, Tooltip } from '@mantine/core'
import { IconCloudUp, IconSearch } from '@tabler/icons-react'

import * as S from './styles'

import TokensInput from '../TokensInput'

type Props = {
  className?: string
  value?: string
  onDeferredChange?: (value: string) => void
  onClick?: () => void
  onSearch?: () => void
}

const SearchInput = forwardRef<HTMLDivElement, Props>(
  ({ className, value, onDeferredChange, onClick, onSearch }, ref) => {
    const allowSearch = (value?.trim().length ?? 0) > 1

    return (
      <Flex ref={ref} className={className}>
        <ActionIcon css={S.leftButton} color="blue" size="xl" variant="filled">
          <IconCloudUp />
        </ActionIcon>

        <TokensInput
          className="flex-1"
          css={S.input}
          size="md"
          placeholder="Start typing a search term"
          autoFocus
          value={value}
          onClick={onClick}
          onChange={onDeferredChange}
        />

        <Tooltip label="Type at least two characters to enable searching" disabled={allowSearch}>
          <div css={S.searchButtonWrapper} data-disabled={!allowSearch}>
            <Button
              css={S.searchButton}
              size="md"
              leftIcon={<IconSearch />}
              onClick={onSearch}
              disabled={!allowSearch}
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
