import type {
  ChangeEvent,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  UIEvent
} from 'react'
import { useImperativeHandle, forwardRef, useRef, useState } from 'react'
import type { TextInputProps } from '@mantine/core'
import { Box, TextInput, Text, clsx } from '@mantine/core'

import useTokens from './hooks/useTokens'
import * as S from './styles'

type Props = Omit<TextInputProps, 'onChange'> & {
  onChange?: (value: string) => void
}

const TokensInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      value,
      onChange,
      onInput,
      onKeyUp,
      onMouseUp,
      onFocus,
      onBlur,
      onScroll,
      ...props
    },
    ref
  ) => {
    const [innerValue, setInnerValue] = useState(value ?? '')
    const [focused, setFocused] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const rendererRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const { updateCurrentToken, renderTokens } = useTokens(inputRef)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Don't allow multiple consecutive spaces in the input
      const val = e.target.value.replace(/\s+/g, ' ')

      setInnerValue(val)
      onChange?.(val)
    }

    const handleInput: FormEventHandler<HTMLInputElement> = e => {
      updateCurrentToken()
      onInput?.(e)
    }

    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = e => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Meta']

      if (keys.includes(e.key)) {
        updateCurrentToken()
      }

      onKeyUp?.(e)
    }

    const handleMouseUp: MouseEventHandler<HTMLInputElement> = e => {
      updateCurrentToken()
      onMouseUp?.(e)
    }

    const handleFocus: FocusEventHandler<HTMLInputElement> = e => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
      setFocused(false)
      onBlur?.(e)
    }

    const handleScroll = (e: UIEvent<HTMLInputElement>) => {
      syncScroll(e.currentTarget.scrollLeft)
      onScroll?.(e)
    }

    const syncScroll = (scroll: number) => {
      if (!rendererRef.current) {
        return
      }

      rendererRef.current.scrollLeft = scroll
    }

    return (
      <Box className={className} css={S.container}>
        <TextInput
          ref={inputRef}
          css={S.input}
          size="md"
          value={innerValue}
          onChange={handleChange}
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onScroll={handleScroll}
          {...props}
        />
        <Text ref={rendererRef} css={S.renderer} className={clsx('renderer', { focused })}>
          {renderTokens()}
        </Text>
      </Box>
    )
  }
)

export default TokensInput
