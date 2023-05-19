import { Box, Text } from '@mantine/core'
import { ImQuotesLeft, ImQuotesRight } from 'react-icons/im'

import useHighlight from '~/hooks/use-highlight'

import * as S from './styles'

type Props = {
  text: string
  queryTerms: string[]
}

const ChunkPreview = ({ text, queryTerms }: Props) => {
  const [textHl] = useHighlight(queryTerms, text)

  return (
    <S.Container>
      <Box px="xl" css={S.root}>
        <div css={S.quote} className="left">
          <ImQuotesLeft size={24} />
        </div>

        <Text color="gray.7" css={S.text}>
          {textHl}
        </Text>

        <div css={S.quote} className="right">
          <ImQuotesRight size={24} />
        </div>
      </Box>
    </S.Container>
  )
}

export default ChunkPreview
