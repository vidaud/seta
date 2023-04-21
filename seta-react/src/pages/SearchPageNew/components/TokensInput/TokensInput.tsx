import type { ChangeEvent, KeyboardEvent, UIEvent } from 'react'
import { useRef, useState } from 'react'
import { Box, TextInput, Text, clsx } from '@mantine/core'

import useTokens from './hooks/useTokens'
import * as S from './styles'

type Props = {
  className?: string
  value?: string
}

const TokensInput = ({ className, value }: Props) => {
  const [innerValue, setInnerValue] = useState(value ?? '')
  const [focused, setFocused] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const rendererRef = useRef<HTMLDivElement>(null)

  const { updateCurrentToken, renderTokens } = useTokens(inputRef)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Don't allow multiple consecutive spaces in the input
    const val = e.target.value.replace(/\s+/g, ' ')

    setInnerValue(val)
  }

  const handleInput = () => {
    updateCurrentToken()
  }

  const handleKeyNavigation = (e: KeyboardEvent<HTMLInputElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Meta']

    if (keys.includes(e.key)) {
      updateCurrentToken()
    }
  }

  const syncScroll = (e: UIEvent<HTMLInputElement>) => {
    if (!rendererRef.current) {
      return
    }

    rendererRef.current.scrollLeft = e.currentTarget.scrollLeft
  }

  return (
    <Box className={className} css={S.container}>
      <TextInput
        ref={inputRef}
        css={S.input}
        size="md"
        value={innerValue}
        onChange={handleChange}
        onMouseUp={handleInput}
        onInput={handleInput}
        onKeyUp={handleKeyNavigation}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onScroll={syncScroll}
      />
      <Text ref={rendererRef} css={S.renderer} className={clsx({ focused })}>
        {renderTokens()}
      </Text>
    </Box>
  )
}

export default TokensInput
