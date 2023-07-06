import type { SerializedStyles } from '@emotion/react'
import type { TextProps } from '@mantine/core'
import { Text } from '@mantine/core'
import { FaChevronDown } from 'react-icons/fa'

import * as S from './styles'

enum Orientation {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

const startStyles: Record<Orientation, SerializedStyles> = {
  [Orientation.UP]: S.upStart,
  [Orientation.DOWN]: S.downStart,
  [Orientation.LEFT]: S.leftStart,
  [Orientation.RIGHT]: S.rightStart
}

const endStyles: Record<Orientation, SerializedStyles> = {
  [Orientation.UP]: S.upEnd,
  [Orientation.DOWN]: S.downEnd,
  [Orientation.LEFT]: S.leftEnd,
  [Orientation.RIGHT]: S.rightEnd
}

type Props = {
  toggled: boolean
  startOrientation?: Orientation
  endOrientation?: Orientation
  color?: TextProps['color']
}

const ChevronToggleIcon = ({
  toggled,
  color = 'gray.7',
  startOrientation = Orientation.DOWN,
  endOrientation = Orientation.UP
}: Props) => {
  const startStyle = startStyles[startOrientation]
  const endStyle = endStyles[endOrientation]

  return (
    <Text css={[S.chevron, startStyle, endStyle]} data-toggled={toggled} color={color} lh={1}>
      <FaChevronDown />
    </Text>
  )
}

export default ChevronToggleIcon
