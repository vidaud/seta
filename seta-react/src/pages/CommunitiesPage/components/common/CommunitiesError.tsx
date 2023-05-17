import { Anchor, Text } from '@mantine/core'

import * as S from './styles'

type Props = {
  message?: string
  onTryAgain?: () => void
}

const CommunitiesError = ({ message, onTryAgain }: Props) => {
  const tryAgain = (
    <>
      <br />
      Please <Anchor onClick={onTryAgain}>try again</Anchor>.
    </>
  )

  return (
    <S.Container>
      <Text fz="sm" color="red.6">
        {message ?? 'There was an error fetching communities.'}

        {onTryAgain && tryAgain}
      </Text>
    </S.Container>
  )
}

export default CommunitiesError
