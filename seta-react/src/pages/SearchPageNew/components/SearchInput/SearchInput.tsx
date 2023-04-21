import { forwardRef } from 'react'
import { ActionIcon, Button, Flex } from '@mantine/core'
import { IconCloudUp, IconSearch } from '@tabler/icons-react'

import * as S from './styles'

import TokensInput from '../TokensInput'

type Props = {
  className?: string
  value?: string
  onClick?: () => void
  onChange?: (value: string) => void
}

const SearchInput = forwardRef<HTMLDivElement, Props>(
  ({ className, value, onClick, onChange }, ref) => {
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
          onChange={onChange}
        />

        <Button css={S.rightButton} size="md" leftIcon={<IconSearch />}>
          Search
        </Button>
      </Flex>
    )
  }
)

export default SearchInput
