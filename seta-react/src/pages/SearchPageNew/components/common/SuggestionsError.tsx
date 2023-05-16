import { Anchor, Flex, Text } from '@mantine/core'
import { BiErrorAlt } from 'react-icons/bi'

import * as S from './styles'
import type { SizeProp } from './types'
import { IconSize } from './types'

type Props = {
  message?: string
  subject?: string
  withIcon?: boolean
  onTryAgain?: () => void
} & SizeProp

const SuggestionsError = ({
  size = 'sm',
  message,
  subject = 'suggestions',
  withIcon,
  onTryAgain
}: Props) => {
  const tryAgain = onTryAgain && (
    <>
      <br />
      Please <Anchor onClick={onTryAgain}>try again</Anchor>.
    </>
  )

  const info = message ?? `There was an error fetching ${subject}.`

  const icon = withIcon && (
    <div css={[S.icon, S.errorIcon]}>
      <BiErrorAlt size={IconSize[size]} />
    </div>
  )

  return (
    <S.Container>
      <Flex align="center" justify="center" gap="sm">
        {icon}

        <Text fz={size} color="red.6">
          {info}
          {tryAgain}
        </Text>
      </Flex>
    </S.Container>
  )
}

export default SuggestionsError
