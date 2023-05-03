import { forwardRef, useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Flex } from '@mantine/core'
import { IconCloudUp, IconSearch } from '@tabler/icons-react'

import * as S from './styles'

import TokensInput from '../TokensInput'

type Props = {
  className?: string
  value?: string
  onDeferredChange?: (value: string) => void
  onClick?: () => void
  onBlur?: () => void
}

const SearchInput = forwardRef<HTMLDivElement, Props>(
  ({ className, value, onDeferredChange, onClick, onBlur }, ref) => {
    const [internalValue, setInternalValue] = useState(value ?? '')

    const timeoutRef = useRef<number | null>(null)
    const setByEffectRef = useRef(false)

    // Keep the handler in a ref to avoid re-rendering inside the effect
    const onChangeRef = useRef(onDeferredChange)

    useEffect(() => {
      setByEffectRef.current = true
      setInternalValue(value ?? '')
    }, [value])

    useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (setByEffectRef.current) {
        setByEffectRef.current = false

        return
      }

      timeoutRef.current = window.setTimeout(() => {
        onChangeRef.current?.(internalValue)
        timeoutRef.current = null
      }, 100)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [internalValue])

    const handleBlur = () => {
      setInternalValue(internalValue.replace(/\s+/g, ' ').trim())
    }

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
          value={internalValue}
          onClick={onClick}
          onChange={setInternalValue}
        />

        <Button css={S.rightButton} size="md" leftIcon={<IconSearch />}>
          Search
        </Button>
      </Flex>
    )
  }
)

export default SearchInput
