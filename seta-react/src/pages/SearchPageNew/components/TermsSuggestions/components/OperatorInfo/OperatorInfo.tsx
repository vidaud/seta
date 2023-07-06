import { Flex } from '@mantine/core'
import { VscSymbolOperator } from 'react-icons/vsc'

import type { Token } from '~/pages/SearchPageNew/types/token'
import { TokenOperator } from '~/pages/SearchPageNew/types/token'

import * as S from './styles'

type Props = {
  token: Token
}

const OperatorInfo = ({ token: { operator } }: Props) => {
  const isOperator = !!operator

  if (!isOperator) {
    return null
  }

  const content =
    operator === TokenOperator.AND ? (
      <>
        <div>
          The <span>AND</span> operator allows you to split the query into groups that <em>must</em>{' '}
          all <br />
          be present in the results.
        </div>
        <div>
          For example, <span>internet science AND technology</span> will return only documents{' '}
          <br /> that contain both <span>internet</span> or <span>science</span>, <em>and</em>{' '}
          <span>technology</span>.
        </div>
      </>
    ) : operator === TokenOperator.OR ? (
      <>
        <div>
          The <span>OR</span> operator allows you to link keywords that <em>can</em> be present in
          the results.
        </div>
        <div>
          For example, <span>science OR technology</span> will return documents that contain either
          term.
        </div>
        <div>This operator can be skipped, as it is used by default under the hood.</div>
      </>
    ) : null

  return (
    <Flex align="center" justify="center" css={S.root}>
      <Flex align="center" justify="center" css={S.container}>
        <div css={S.icon}>
          <VscSymbolOperator size={48} />
        </div>

        <div css={S.content}>{content}</div>
      </Flex>
    </Flex>
  )
}

export default OperatorInfo
