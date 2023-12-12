import type { ComponentPropsWithRef } from 'react'
import type { MantineNumberSize } from '@mantine/core'
import { rem } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import type { ActionIconExtendedProps } from '~/components/ActionIconExtended'
import ActionIconExtended from '~/components/ActionIconExtended'

type Props = {
  iconSize?: MantineNumberSize
} & ComponentPropsWithRef<'button'> &
  Omit<ActionIconExtendedProps, 'children'>

const iconSizes: Record<MantineNumberSize, string> = {
  xs: rem(12),
  sm: rem(16),
  md: rem(20),
  lg: rem(28),
  xl: rem(34)
}

const ClearButton = ({ size = 'sm', iconSize, ...props }: Props) => {
  const iconSizeValue = rem(iconSize ?? iconSizes[size])

  return (
    <ActionIconExtended size="sm" className="seta-ClearButton-root" {...props}>
      <IconX width={iconSizeValue} height={iconSizeValue} />
    </ActionIconExtended>
  )
}

export default ClearButton
