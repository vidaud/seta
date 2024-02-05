import type { ReactNode } from 'react'
import type { DefaultMantineColor } from '@mantine/core'

import useThemeColor from '~/hooks/use-theme-color'

import * as S from './styles'

type ChildrenProps = {
  getThemeColor: (color: DefaultMantineColor) => string
}

type Props = {
  color?: DefaultMantineColor
  children: ReactNode | (({ getThemeColor }: ChildrenProps) => ReactNode)
}

const Color = ({ color, children }: Props) => {
  const { getThemeColor } = useThemeColor()

  const style = color ? { color: getThemeColor(color) } : undefined

  const childrenValue = typeof children === 'function' ? children({ getThemeColor }) : children

  return (
    <div css={S.root} style={style}>
      {childrenValue}
    </div>
  )
}

export default Color
