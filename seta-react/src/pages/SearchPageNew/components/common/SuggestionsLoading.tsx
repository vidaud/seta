import type { DefaultMantineColor, LoaderProps, MantineStyleSystemProps } from '@mantine/core'
import { Flex, Loader } from '@mantine/core'

import type { SizeProp } from '~/types/size'

type Props = {
  color?: DefaultMantineColor
  variant?: LoaderProps['variant']
} & SizeProp &
  MantineStyleSystemProps

const SuggestionsLoading = ({
  color = 'gray',
  size = 'md',
  variant,
  mt = '2rem',
  ...styles
}: Props) => {
  return (
    <Flex
      className="seta-SuggestionsLoading-root"
      align="center"
      justify="center"
      mt={mt}
      {...styles}
    >
      <Loader color={color} size={size} variant={variant} />
    </Flex>
  )
}

export default SuggestionsLoading
