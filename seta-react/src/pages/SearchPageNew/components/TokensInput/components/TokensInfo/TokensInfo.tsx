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

  const count = useMemo(() => tokens.filter(t => !t.operator).length, [tokens])

  // Memoize the displayed count so that we can hide the info before it changes back to 1 or 0
  const memoCount = useMemo(() => {
    let result = count

    if (result < 2) {
      result = lastCountRef.current
    }

    lastCountRef.current = result

    return result
  }, [count])

  return (
    <>
      <Center css={S.item} data-visible={enrichQuery && count > 0}>
        <IconWand css={S.enrichedIcon} />
      </Center>

      <Flex align="center" css={S.item} data-visible={count > 1}>
        <div css={S.tokens}>{memoCount}</div>
        <div>keywords</div>
      </Flex>
    </>
  )
}

export default TokensInfo
