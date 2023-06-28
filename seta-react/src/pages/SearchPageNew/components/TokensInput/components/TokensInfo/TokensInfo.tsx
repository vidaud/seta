import { useMemo, useRef } from 'react'
import { Center, Flex } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import type { Token } from '~/pages/SearchPageNew/types/token'

import * as S from './styles'

type Props = {
  tokens: Token[]
  enrichQuery?: boolean
}

const TokensInfo = ({ tokens, enrichQuery }: Props) => {
  const lastCountRef = useRef(tokens.length)

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
    <>
      <Center css={S.item} data-visible={enrichQuery && tokens.length > 0}>
        <IconWand css={S.enrichedIcon} />
      </Center>

      <Flex align="center" css={S.item} data-visible={tokens.length > 1}>
        <div css={S.tokens}>{count}</div>
        <div>keywords</div>
      </Flex>
    </>
  )
}

export default TokensInfo
