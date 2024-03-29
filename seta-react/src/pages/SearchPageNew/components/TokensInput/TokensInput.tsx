import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  UIEvent
} from 'react'
import { useEffect, useImperativeHandle, forwardRef, useRef, useState } from 'react'
import type { TextInputProps } from '@mantine/core'
import { ActionIcon, Box, TextInput, Text, clsx } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearchInput } from '~/pages/SearchPageNew/contexts/search-input-context'

import TokensInfo from './components/TokensInfo'
import useTokens from './hooks/use-tokens'
import * as S from './styles'

type Props = Omit<TextInputProps, 'onChange'> & {
  enrichQuery?: boolean
  onChange?: (value: string) => void
}

const TokensInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      enrichQuery,
      value,
      onChange,
      onKeyDown,
      onKeyUp,
      onMouseUp,
      onFocus,
      onBlur,
      onScroll,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const rendererRef = useRef<HTMLDivElement>(null)

    const timeoutRef = useRef<number | null>(null)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const { updateCurrentToken, renderTokens, tokens } = useTokens(String(value), inputRef, focused)
    const { setInputRef, onBlur: onBlurContext } = useSearchInput()

    useEffect(() => {
      if (inputRef.current) {
        setInputRef(inputRef.current)
      }
    }, [setInputRef])

    const markTyping = (e: KeyboardEvent<HTMLInputElement>) => {
      if (
        (e.key.length !== 1 && e.key !== 'Backspace' && e.key !== 'Delete') ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setIsTyping(true)

      timeoutRef.current = window.setTimeout(() => {
        setIsTyping(false)
        syncScroll(inputRef.current?.scrollLeft ?? 0)
      }, 200)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
      const ignoreKeys = ['ArrowUp', 'ArrowDown', '(', ')']

      if (ignoreKeys.includes(e.key)) {
        e.preventDefault()

        return
      }

      const position = e.currentTarget.selectionStart ?? 0
      const val = e.currentTarget.value

      if (
        e.key === ' ' &&
        (val.slice(position - 2, position) === '  ' ||
          val.slice(position, position + 2) === '  ' ||
          val.slice(position - 1, position + 1) === '  ')
      ) {
        e.preventDefault()

        return
      }

      markTyping(e)

      onKeyDown?.(e)
    }

    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = e => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Meta', 'Home', 'End']

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
      onBlurContext?.()
    }

    const syncScroll = (scroll: number) => {
      if (!rendererRef.current) {
        return
      }

      rendererRef.current.scrollLeft = scroll
    }

    const handleScroll = (e: UIEvent<HTMLInputElement>) => {
      syncScroll(e.currentTarget.scrollLeft)
      onScroll?.(e)
    }

    const handleClear = () => {
      onChange?.('')
      updateCurrentToken()

      inputRef.current?.focus()
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()

      const text = e.clipboardData.getData('text/plain').replace(/\(|\)/g, '')

      onChange?.(text)
    }

    const clearButton = !!value && (
      <ActionIcon size="sm" onClick={handleClear}>
        <IconX />
      </ActionIcon>
    )

    return (
      <Box className={className} css={S.container}>
        <TextInput
          ref={inputRef}
          css={S.input}
          size="md"
          rightSection={clearButton}
          spellCheck={false}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onScroll={handleScroll}
          onPaste={handlePaste}
          {...props}
        />
        <Text
          ref={rendererRef}
          css={S.renderer}
          className={clsx('renderer', { focused, typing: isTyping })}
        >
          {renderTokens()}
        </Text>

        <div css={S.bg} />

        <TokensInfo tokens={tokens} enrichQuery={enrichQuery} />
      </Box>
    )
  }
)

export default TokensInput
