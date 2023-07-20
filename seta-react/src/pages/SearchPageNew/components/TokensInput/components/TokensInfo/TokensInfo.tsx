import { useMemo } from 'react'
import { Center, Flex } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import type { Token } from '~/pages/SearchPageNew/types/token'

import useMinValue from '~/hooks/use-min-value'

import * as S from './styles'

type Props = {
  tokens: Token[]
  enrichQuery?: boolean
}

const TokensInfo = ({ tokens, enrichQuery }: Props) => {
  const count = useMemo(() => tokens.filter(t => !t.operator).length, [tokens])

  // Keep the displayed count above 2 so that we can hide the info before it changes back to 1 or 0
  const displayedCount = useMinValue(count, 2)

  return (
    <>
      <Center css={S.item} data-visible={enrichQuery && count > 0}>
        <IconWand css={S.enrichedIcon} />
      </Center>

      <Flex align="center" css={S.item} data-visible={count > 1}>
        <div css={S.tokens}>{displayedCount}</div>
        <div>keywords</div>
      </Flex>
    </>
  )
}

export default TokensInfo
