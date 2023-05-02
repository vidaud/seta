import type { RefObject } from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { clsx } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import type { Token } from '~/pages/SearchPageNew/components/SuggestionsPopup/types/token'

const EXPRESSION_REGEX = /("[^"\\]*(\\.[^"\\]*)*"|\S+)(\s*)/g

/**
 * Returns the current word and its position in the given string value based on the cursor position.
 * @param value The value to search in
 * @param position The position of the cursor
 */
const getCurrentWord = (value: string, position: number) => {
  const leftText = value.slice(0, position)
  const rightText = value.slice(position)

  const leftBoundary = leftText.lastIndexOf(' ') + 1
  const rightBoundary =
    (rightText.indexOf(' ') === -1 ? rightText.length : rightText.indexOf(' ')) + position

  const word = value.slice(leftBoundary, rightBoundary)

  return {
    rawWord: word,
    word: word.replace(/"/g, ''),
    index: leftBoundary
  }
}

const useTokens = (inputRef: RefObject<HTMLInputElement>) => {
  const [noHighligh, setNoHighligh] = useState(false)
  const { currentToken, setCurrentToken, tokens, setTokens } = useSearch()

  const timeoutRef = useRef<number | null>(null)

  const value = inputRef.current?.value

  const getTokens = useCallback((): Token[] => {
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

  const hideHighlight = () => {
    setNoHighligh(true)
  }

  // const internalUpdateToken = useCallback(() => {
  //   if (!inputRef.current) {
  //     return
  //   }

  //   const position = inputRef.current.selectionStart ?? 0

  //   let found: Token | null = null

  //   for (const token of tokens) {
  //     const start = token.index
  //     const end = start + token.token.length

  //     if (position >= start && position <= end) {
  //       found = token
  //       break
  //     }
  //   }

  //   if (found) {
  //     setCurrentToken({
  //       ...found,
  //       word: found.token
  //     })
  //   }
  // }, [inputRef, setCurrentToken, tokens])

  const internalUpdateToken = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    const value = inputRef.current.value
    const position = inputRef.current.selectionStart ?? 0

    const regex = /("[^"]*")/g

    let match: RegExpExecArray | null
    let token: string | null = null
    let word: string | null = null
    let isExpression = false
    let index = 0

    // First, try to match an expression in quotes relative to the cursor position
    while ((match = regex.exec(value)) !== null) {
      const start = match.index
      const end = start + match[0].length

      if (position >= start && position <= end) {
        const { word: wordMatch } = getCurrentWord(match[0], position - start)

        token = match[1]
        word = wordMatch
        index = start
        isExpression = true
        break
      }
    }

    // If no match was found, we're dealing with a single word
    if (!token || !word) {
      const { rawWord, word: wordMatch, index: wordIndex } = getCurrentWord(value, position)

      token = rawWord
      word = wordMatch
      index = wordIndex
    }

    setCurrentToken({ token, word, index, isExpression })
  }, [inputRef, setCurrentToken])

  const clearCurrentToken = useCallback(() => {
    setCurrentToken(null)
  }, [setCurrentToken])

  const updateCurrentToken = useCallback(() => {
    // if (!inputRef.current) {
    //   return
    // }

    // if (timeoutRef.current) {
    //   clearTimeout(timeoutRef.current)
    // }

    // timeoutRef.current = setTimeout(() => {
    internalUpdateToken()
    // }, 200)
  }, [internalUpdateToken])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const tk = getTokens()

      setTokens(tk)

      console.log('tokens', tk)

      setNoHighligh(false)

      updateCurrentToken()

      // internalUpdateToken()

      timeoutRef.current = null
    }, 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, setTokens, getTokens, updateCurrentToken])

  const renderTokens = useCallback(() => {
    if (!inputRef.current) {
      return null
    }

    if (!tokens.length) {
      return null
    }

    // const value = inputRef.current.value

    // // Split the input value into tokens, which are either expressions in quotes or single words
    // const tokens = value.match(EXPRESSION_REGEX)

    // if (!tokens) {
    //   return value
    // }

    // The index helps match the token around the cursor position,
    // in case there are multiple identical tokens in the input
    let index = 0

    const highlightedTokens = tokens.map(({ token, spacesAfter, isExpression }) => {
      const isCurrentToken =
        !noHighligh && token === currentToken?.token && index === currentToken.index

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

          {/* {i < tokens.length - 1 && ' '} */}
          {spacesAfter && String(' ').repeat(spacesAfter)}
        </span>
      )
    })

    return highlightedTokens
  }, [inputRef, tokens, currentToken?.token, currentToken?.index, noHighligh])

  return { updateCurrentToken, clearCurrentToken, renderTokens, hideHighlight }
}

export default useTokens
