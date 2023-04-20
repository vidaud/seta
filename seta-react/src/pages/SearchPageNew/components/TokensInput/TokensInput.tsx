import { useRef, useState } from 'react'
import { Box, TextInput, Text } from '@mantine/core'

import * as S from './styles'

type Props = {
  className?: string
  value?: string
}

const TokensInput = ({ className, value }: Props) => {
  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const [innerValue, setInnerValue] = useState(value ?? '')

  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = () => {
    if (!inputRef.current) {
      return
    }

    if (!innerValue.trim().match(/\s/)) {
      setCurrentWord(null)

      return
    }

    const position = inputRef.current.selectionStart ?? 0

    const leftText = innerValue.slice(0, position)
    const rightText = innerValue.slice(position)

    const leftBoundary = leftText.lastIndexOf(' ') + 1
    const rightBoundary =
      (rightText.indexOf(' ') === -1 ? rightText.length : rightText.indexOf(' ')) + position

    const word = innerValue.slice(leftBoundary, rightBoundary)

    setCurrentWord(word)
  }

  const highlightedText = innerValue.split(' ').map((word, index) => {
    const cls = word === currentWord ? 'highlighted' : ''

    return (
      // <span key={index} className={cls}>
      //   {word}
      // </span>
      <span key={index}>
        <span className={cls}>{word}</span>
        {index < innerValue.split(' ').length - 1 && ' '}
      </span>
    )
  })

  return (
    <Box className={className} css={S.container}>
      <TextInput
        ref={inputRef}
        css={S.input}
        size="md"
        value={innerValue}
        onChange={e => setInnerValue(e.target.value)}
        onMouseUp={handleInput}
        onKeyUp={handleInput}
      />
      <Text css={S.renderer}>{highlightedText}</Text>
    </Box>
  )
}

export default TokensInput
