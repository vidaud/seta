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
import { ActionIcon, Box, TextInput, Text, clsx } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'

import useTokens from './hooks/use-tokens'
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
    // const [innerValue, setInnerValue] = useState(value ?? '')
    const [focused, setFocused] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const rendererRef = useRef<HTMLDivElement>(null)

    const timeoutRef = useRef<number | null>(null)

    // Save the cursor position without re-rendering
    const nextPositionRef = useRef<number | null>(null)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const { updateCurrentToken, renderTokens } = useTokens(String(value), inputRef)
    const { setInputRef } = useSearch()

    const mustSetPosition = nextPositionRef.current !== null

    // const updateCurrentTokenDeferred = () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current)
    //   }

    //   timeoutRef.current = window.setTimeout(() => {
    //     updateCurrentToken()
    //     timeoutRef.current = null
    //   }, 200)
    // }

    // Set the cursor position after the input value has been updated
    // useEffect(() => {
    //   if (mustSetPosition && inputRef.current) {
    //     inputRef.current.setSelectionRange(nextPositionRef.current, nextPositionRef.current)
    //     nextPositionRef.current = null
    //   }
    // }, [mustSetPosition])

    // useEffect(() => {
    //   // setInnerValue(value ?? '')

    //   // Update the input value to correctly render updated tokens
    //   if (inputRef.current) {
    //     inputRef.current.value = String(value) ?? ''
    //     updateCurrentToken()
    //   }
    // }, [value, updateCurrentToken])

    if (inputRef.current) {
      setInputRef(inputRef.current)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // updateCurrentToken()
      // const position = e.target.selectionStart ?? 0

      // Don't allow multiple consecutive spaces in the input
      const val = e.target.value //.replace(/\s+/g, ' ')

      // If the user is typing in the middle of the input and we removed spaces,
      // keep the cursor in place
      // nextPositionRef.current =
      //   val.length !== e.target.value.length && position < val.length ? position : null

      // setInnerValue(val)
      onChange?.(val)
    }

    const handleInput: FormEventHandler<HTMLInputElement> = e => {
      // updateCurrentToken()
      // updateTokesDeferred()
      // updateCurrentTokenDeferred()
      onInput?.(e)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
      const ignoreKeys = ['ArrowUp', 'ArrowDown']

      if (ignoreKeys.includes(e.key)) {
        e.preventDefault()
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
      }

      onKeyDown?.(e)
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

    const handleSelect = () => {
      // updateCurrentToken()
    }

    const handleClear = () => {
      // setInnerValue('')
      onChange?.('')
      updateCurrentToken()

      inputRef.current?.focus()
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
          value={value}
          onChange={handleChange}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onScroll={handleScroll}
          onSelect={handleSelect}
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
