import type { DefaultMantineColor, MantineStyleSystemProps } from '@mantine/core'
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
} & SizeProp &
  MantineStyleSystemProps

const SuggestionsEmpty = ({
  message,
  secondary,
  size = 'sm',
  color = 'gray.6',
  withIcon,
  iconColor = 'gray.5',
  mt = '2rem',
  ...styles
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
    <Flex align="center" justify="center" gap="sm" mt={mt} {...styles}>
      {icon}

      <Text fz={size} color={color}>
        {message ?? 'No results'}
        {secondaryMessage}
      </Text>
    </Flex>
  )
}

export default SuggestionsEmpty
