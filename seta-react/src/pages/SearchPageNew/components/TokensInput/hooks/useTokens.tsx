import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

type TokenMatch = {
  token: string
  index: number
}

const useTokens = (inputRef: RefObject<HTMLInputElement>) => {
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  const updateCurrentToken = () => {
    if (!inputRef.current) {
      return
    }

    const value = inputRef.current.value

    if (!value.trim().match(/\s/)) {
      setCurrentToken(null)

      return
    }

    const position = inputRef.current.selectionStart ?? 0

    const regex = /("[^"]*")/g

    let match: RegExpExecArray | null
    let token: string | null = null
    let index = 0

    // First, try to match an expression in quotes relative to the cursor position
    while ((match = regex.exec(value)) !== null) {
      const start = match.index
      const end = start + match[0].length

      if (position >= start && position <= end) {
        token = match[1]
        index = start
        break
      }
    }

    // If no match was found, we're dealing with a single word
    if (!token) {
      const leftText = value.slice(0, position)
      const rightText = value.slice(position)

      const leftBoundary = leftText.lastIndexOf(' ') + 1
      const rightBoundary =
        (rightText.indexOf(' ') === -1 ? rightText.length : rightText.indexOf(' ')) + position

      token = value.slice(leftBoundary, rightBoundary)
      index = leftBoundary
    }

    setCurrentToken({ token, index })
  }

  const renderTokens = useCallback(() => {
    if (!inputRef.current) {
      return null
    }

    const value = inputRef.current.value
    const tokens = value.match(/"[^"\\]*(\\.[^"\\]*)*"|\S+/g)

    if (!tokens) {
      return value
    }

    // The index helps match the token around the cursor position
    let index = 0

    const highlightedTokens = tokens.map((token, i) => {
      const isCurrentToken = token === currentToken?.token && index === currentToken.index
      const isExpression = token.length > 1 && token.startsWith('"') && token.endsWith('"')

      const cls = isCurrentToken ? 'highlighted' : ''

      const quote = isExpression && <span className="quote">"</span>
      const tokenValue = isExpression ? token.slice(1, -1) : token
      const expressionMarker = isExpression && <span className="expression-marker">=</span>

      index += token.length + 1

      return (
        <span key={index}>
          <span className={cls}>
            {quote}
            {tokenValue}
            {quote}

            {expressionMarker}
          </span>

          {i < tokens.length - 1 && ' '}
        </span>
      )
    })

    return highlightedTokens
  }, [inputRef, currentToken?.token, currentToken?.index])

  return { updateCurrentToken, renderTokens }
}

export default useTokens
