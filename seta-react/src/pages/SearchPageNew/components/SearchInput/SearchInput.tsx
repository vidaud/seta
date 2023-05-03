import { forwardRef, useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Flex } from '@mantine/core'
import { IconCloudUp, IconSearch } from '@tabler/icons-react'

import * as S from './styles'

import TokensInput from '../TokensInput'

type Props = {
  className?: string
  deferredValue?: string
  onChange?: (value: string) => void
  // value?: string
  onClick?: () => void
  // onChange?: (value: string) => void
}

const SearchInput = forwardRef<HTMLDivElement, Props>(
  ({ className, onClick, deferredValue, onChange }, ref) => {
    const [value, setValue] = useState(deferredValue ?? '')
    // const [debouncedValue] = useDebouncedValue(value, 200)
    // const { inputValue, setInputValue } = useSearch()

    const timeoutRef = useRef<number | null>(null)
    const setByEffectRef = useRef(false)

    useEffect(() => {
      setByEffectRef.current = true
      setValue(deferredValue ?? '')
    }, [deferredValue])

    useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (setByEffectRef.current) {
        setByEffectRef.current = false

        return
      }

      timeoutRef.current = window.setTimeout(() => {
        onChange?.(value)
        timeoutRef.current = null
      }, 100)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [onChange, value])

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
          onChange={setValue}
        />

        <Button css={S.rightButton} size="md" leftIcon={<IconSearch />}>
          Search
        </Button>
      </Flex>
    )
  }
)

export default SearchInput
