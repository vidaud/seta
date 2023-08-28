import type { ReactNode } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import { FiCheckSquare, FiSquare } from 'react-icons/fi'

type SelectActionInfo = {
  tooltip: string
  icon: ReactNode
  color: DefaultMantineColor
}

export const SELECT_ALL_INFO: SelectActionInfo = {
  tooltip: 'Select all',
  icon: <FiCheckSquare size="1.3rem" />,
  color: 'teal'
}

export const SELECT_NONE_INFO: SelectActionInfo = {
  tooltip: 'Select none',
  icon: <FiSquare size="1.3rem" />,
  color: 'pink'
}
