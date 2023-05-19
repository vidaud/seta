import type { DefaultMantineColor } from '@mantine/core'
import { Box, Flex, Text } from '@mantine/core'
import { BiInfoCircle } from 'react-icons/bi'

import * as S from './styles'
import type { SizeProp } from './types'
import { IconSize } from './types'

type Props = {
  message?: string
  secondary?: string
  withIcon?: boolean
  color?: DefaultMantineColor
  iconColor?: DefaultMantineColor
} & SizeProp

const SuggestionsEmpty = ({
  message,
  secondary,
  size = 'sm',
  color = 'gray.6',
  withIcon,
  iconColor = 'gray.5'
}: Props) => {
  const icon = withIcon && (
    <Box
      css={[S.icon]}
      sx={theme => ({
        color: theme.fn.themeColor(iconColor)
      })}
    >
      <BiInfoCircle size={IconSize[size]} />
    </Box>
  )

  const secondaryMessage = secondary && (
    <>
      <br />
      {secondary}
    </>
  )

  return (
    <S.Container>
      <Flex align="center" justify="center" gap="sm">
        {icon}

        <Text fz={size} color={color}>
          {message ?? 'No results'}
          {secondaryMessage}
        </Text>
      </Flex>
    </S.Container>
  )
}

export default SuggestionsEmpty
