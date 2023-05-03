import type { RefObject } from 'react'
import { useRef, useMemo, useEffect, useCallback } from 'react'
import { clsx } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import type { Token } from '~/pages/SearchPageNew/components/SuggestionsPopup/types/token'

const EXPRESSION_REGEX = /("[^"\\]*(\\.[^"\\]*)*"|\S+)(\s*)/g

const useTokens = (value: string, inputRef: RefObject<HTMLInputElement>) => {
  const { currentToken, setCurrentToken, tokens, setTokens } = useSearch()

  const updateRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const hasValue = useMemo(() => !!value, [value])

  const newTokens = useMemo((): Token[] => {
    if (!value) {
      return []
    }

    const result: Token[] = []

    let match: RegExpExecArray | null

    while ((match = EXPRESSION_REGEX.exec(value)) !== null) {
      const start = match.index
      const token = match[1]
      const spacesAfter = match[3]?.length ?? 0

      result.push({
        token,
        index: start,
        isExpression: !!token.match(/\s/),
        spacesAfter
      })
    }

    return result
  }, [value])

  const selectLeftToken = useCallback(
    (position: number) => {
      const found = tokens.find(({ index, token }) => {
        const end = index + token.length

        return position >= index && position <= end + 2
      })

      return found
    },
    [tokens]
  )

  const updateCurrentToken = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    const position = inputRef.current.selectionStart ?? 0

    let found = tokens.find(({ index, token }) => {
      const start = index
      const end = start + token.length

      return position >= start && position <= end
    })

    if (!found) {
      found = selectLeftToken(position)
    }

    if (found) {
      setCurrentToken({
        ...found,
        word: found.token
      })
    } else {
      setCurrentToken(null)
    }
  }, [inputRef, tokens, selectLeftToken, setCurrentToken])

  const updateCurrentTokenDeferred = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      updateCurrentToken()
      timeoutRef.current = null
    }, 200)
  }, [updateCurrentToken])

  useEffect(() => {
    // if (updateRef.current) {
    //   clearTimeout(updateRef.current)
    // }

    // updateRef.current = window.setTimeout(() => {
    //   setTokens(newTokens)
    //   updateRef.current = null

    //   updateCurrentTokenDeferred()
    // }, 0)

    setTokens(newTokens)

    updateCurrentTokenDeferred()
  }, [newTokens, setTokens, updateCurrentTokenDeferred])

  const renderTokens = useCallback(() => {
    if (!inputRef.current) {
      return null
    }

    if (!tokens.length) {
      return null
    }

    let index = 0

    const highlightedTokens = tokens.map(({ token, spacesAfter, isExpression }) => {
      const isCurrentToken = token === currentToken?.token && index === currentToken.index

      const cls = {
        root: clsx({ current: isCurrentToken && tokens.length > 1, expression: isExpression }),
        token: clsx({ highlighted: isCurrentToken })
      }

      const quote = isExpression && <span className="quote">"</span>
      const tokenValue = isExpression ? token.slice(1, -1) : token

      index += token.length + (spacesAfter ?? 0)

      return (
        <span key={index} className={cls.root}>
          <span className={cls.token}>
            {quote}
            {tokenValue}
            {quote}

            <span className="marker" />
          </span>

          {spacesAfter && String(' ').repeat(spacesAfter)}
        </span>
      )
    })

    return highlightedTokens
  }, [inputRef, tokens, currentToken?.token, currentToken?.index])

  return { updateCurrentToken, renderTokens }
}

export default useTokens
