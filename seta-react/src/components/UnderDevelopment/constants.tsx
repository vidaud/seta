import type { ReactNode } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import { IoIosInformationCircle, IoIosWarning } from 'react-icons/io'

export type Variant = 'under-development' | 'coming-soon'

export const TITLE: Record<Variant, string> = {
  'under-development': 'Under development',
  'coming-soon': 'Coming soon!'
}

export const TEXT: Record<Variant, string> = {
  'under-development':
    'This feature is under development and should be used for demo purposes only.',
  'coming-soon': 'This feature will be available soon.'
}

export const COLOR: Record<Variant, DefaultMantineColor> = {
  'under-development': 'pink',
  'coming-soon': 'blue'
}

export const ICON: Record<Variant, ReactNode> = {
  'under-development': <IoIosWarning size={20} />,
  'coming-soon': <IoIosInformationCircle size={20} />
}
