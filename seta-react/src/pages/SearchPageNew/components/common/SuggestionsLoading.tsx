import type { DefaultMantineColor, LoaderProps } from '@mantine/core'
import { Loader } from '@mantine/core'

import * as S from './styles'
import type { SizeProp } from './types'

type Props = {
  color?: DefaultMantineColor
  variant?: LoaderProps['variant']
} & SizeProp

const SuggestionsLoading = ({ color = 'gray', size = 'md', variant }: Props) => {
  return (
    <S.Container>
      <Loader color={color} size={size} variant={variant} />
    </S.Container>
  )
}

export default SuggestionsLoading
