import { useMemo, useRef } from 'react'
import { Flex, clsx } from '@mantine/core'

import type { Token } from '~/pages/SearchPageNew/types/token'

import * as S from './styles'

type Props = {
  tokens: Token[]
}

const TokensInfo = ({ tokens }: Props) => {
  const lastCountRef = useRef(tokens.length)

  const cls = clsx({ 'has-tokens': tokens.length > 1 })

  // Memoize the count so that we can hide it before it changes back to 1 or 0
  const count = useMemo(() => {
    let result = tokens.length

    if (result < 2) {
      result = lastCountRef.current
    }

    lastCountRef.current = result

    return result
  }, [tokens.length])

  return (
    <Flex align="center" className={cls} css={S.root}>
      <div css={S.tokens}>{count}</div>
      <div>tokens</div>
    </Flex>
  )
}

export default TokensInfo
