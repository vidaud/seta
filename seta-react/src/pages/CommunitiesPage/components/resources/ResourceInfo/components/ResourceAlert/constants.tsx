import type { ReactNode } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import { IoIosWarning } from 'react-icons/io'

export type Variant = 'resource-type'

export const TITLE: Record<Variant, string> = {
  'resource-type': 'Please Notice'
}

export const TEXT: Record<Variant, string> = {
  'resource-type':
    'This field can not be reverted once you create the resource. \n Make sure you selected the right option. Default value is "Discoverable".'
}

export const COLOR: Record<Variant, DefaultMantineColor> = {
  'resource-type': 'pink'
}

export const ICON: Record<Variant, ReactNode> = {
  'resource-type': <IoIosWarning size={20} />
}
