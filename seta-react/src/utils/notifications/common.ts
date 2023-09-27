import type { Keyframes } from '@emotion/react'
import type { DefaultMantineColor } from '@mantine/core'

import { growAndRestore, rollSlideRight, wiggleX } from '~/styles/keyframe-animations'

export type NotificationType = 'info' | 'success' | 'error'

export const COLOR: Record<NotificationType, DefaultMantineColor> = {
  info: 'blue',
  success: 'teal',
  error: 'red'
}

export const SVG_SCALE: Record<NotificationType, number> = {
  info: 1.1,
  success: 1.1,
  error: 1
}

export const ANIMATION: Record<NotificationType, Keyframes> = {
  info: growAndRestore,
  success: rollSlideRight,
  error: wiggleX
}
