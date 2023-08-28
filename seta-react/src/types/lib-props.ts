import type { ActionIconProps } from '@mantine/core'

export type ModalStateProps = {
  opened: boolean
  onClose: () => void
}

export type Variant = ActionIconProps['variant']
export type Color = ActionIconProps['color']
