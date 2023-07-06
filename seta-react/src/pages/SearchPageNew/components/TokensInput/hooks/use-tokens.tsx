import type { RefObject } from 'react'
import { useRef, useMemo, useEffect, useCallback } from 'react'
import { clsx } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import type { Token } from '~/pages/SearchPageNew/types/token'
import { TokenType, TokenOperator } from '~/pages/SearchPageNew/types/token'

const EXPRESSION_REGEX = /("[^"\\]*(\\.[^"\\]*)*"|\S+)(\s*)/g
const OPERATOR_REGEX = /^(AND|OR)$/

const processMatch = (match: RegExpExecArray): Token => {
  const start = match.index
  const token = match[1]
  const spacesAfter = match[3]?.length ?? 0

  const type: TokenType = token.match(OPERATOR_REGEX)
    ? TokenType.OPERATOR
    : token.match(/\s/)
    ? TokenType.EXPRESSION
    : TokenType.WORD

  const operator: TokenOperator | undefined =
    type === TokenType.OPERATOR ? TokenOperator[token] : undefined

  const rawValue = type === TokenType.EXPRESSION ? token.replace(/"/g, '') : token

  return {
    token,
    rawValue,
    index: start,
    type,
    operator,
    spacesAfter
  }
}

const useTokens = (value: string, inputRef: RefObject<HTMLInputElement>, focused: boolean) => {
  const { currentToken, setCurrentToken, tokens, setTokens } = useSearch()

  const timeoutRef = useRef<number | null>(null)

  const newTokens = useMemo((): Token[] => {
    if (!value) {
      return []
    }

    const result: Token[] = []

    let match: RegExpExecArray | null

    while ((match = EXPRESSION_REGEX.exec(value)) !== null) {
      const token = processMatch(match)

      result.push(token)
    }

    return result
  }, [value])

  const selectLeftToken = useCallback(
    (position: number) => {
      const found = tokens.find(
        ({ index, token }) => position >= index && position <= index + token.length + 2
      )

      return found
    },
    [tokens]
  )

  const updateCurrentToken = useCallback(() => {
    if (!inputRef.current || !focused) {
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
  }, [inputRef, focused, tokens, selectLeftToken, setCurrentToken])

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

    const highlightedTokens = tokens.map(({ token, spacesAfter, type, rawValue, operator }) => {
      const isCurrentToken = token === currentToken?.token && index === currentToken.index
      const isExpression = type === TokenType.EXPRESSION
      const isOperator = type === TokenType.OPERATOR

      const cls = {
        root: clsx({
          current: isCurrentToken && tokens.length > 1,
          expression: isExpression,
          operator: isOperator,
          'operator-and': operator === TokenOperator.AND,
          'operator-or': operator === TokenOperator.OR
        }),
        token: clsx({ highlighted: isCurrentToken })
      }

      const quote = isExpression && <span className="quote">"</span>

      index += token.length + (spacesAfter ?? 0)

      return (
        <span key={index} className={cls.root}>
          <span className={cls.token}>
            {quote}
            {rawValue}
            {quote}

            <span className="marker" />
          </span>

          {!!spacesAfter && ' '.repeat(spacesAfter)}
        </span>
      )
    })

    return highlightedTokens
  }, [inputRef, tokens, currentToken?.token, currentToken?.index])

  return { updateCurrentToken, updateCurrentTokenDeferred, renderTokens, tokens }
}

export default useTokens
