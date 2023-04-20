import { useRef, useState } from 'react'
import { Box, TextInput, Text } from '@mantine/core'

import useTokens from './hooks/useTokens'
import * as S from './styles'

type Props = {
  className?: string
  value?: string
}

const TokensInput = ({ className, value }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [innerValue, setInnerValue] = useState(value ?? '')

  const { updateCurrentToken, renderTokens } = useTokens(inputRef)

  const handleInput = () => {
    updateCurrentToken()
  }

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
      <Text css={S.renderer}>{renderTokens()}</Text>
    </Box>
  )
}

export default TokensInput
