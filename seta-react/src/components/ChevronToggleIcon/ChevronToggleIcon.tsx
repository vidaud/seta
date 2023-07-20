import type { SerializedStyles } from '@emotion/react'
import type { TextProps } from '@mantine/core'
import { Text } from '@mantine/core'
import { FaChevronDown } from 'react-icons/fa'

import type { ClassNameProp } from '~/types/children-props'

import * as S from './styles'

type Orientation = 'up' | 'down' | 'left' | 'right'

const startStyles: Record<Orientation, SerializedStyles> = {
  up: S.upStart,
  down: S.downStart,
  left: S.leftStart,
  right: S.rightStart
}

const endStyles: Record<Orientation, SerializedStyles> = {
  up: S.upEnd,
  down: S.downEnd,
  left: S.leftEnd,
  right: S.rightEnd
}

type Props = ClassNameProp & {
  toggled: boolean
  start?: Orientation
  end?: Orientation
  color?: TextProps['color']
  size?: TextProps['size']
}

const ChevronToggleIcon = ({
  toggled,
  color = 'gray.7',
  start = 'down',
  end = 'up',
  size,
  className
}: Props) => {
  const startStyle = startStyles[start]
  const endStyle = endStyles[end]

  return (
    <Text
      className={className}
      css={[S.chevron, startStyle, endStyle]}
      data-toggled={toggled}
      color={color}
      size={size}
      lh={1}
    >
      <FaChevronDown />
    </Text>
  )
}

export default ChevronToggleIcon
