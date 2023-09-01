import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { Tooltip } from '@mantine/core'

import ActionIconExtended from '~/components/ActionIconExtended'

import type { Color } from '~/types/lib-props'

type Props = Omit<ComponentProps<typeof ActionIconExtended>, 'hoverColor' | 'hoverVariant'> & {
  toggledColor?: Color
  tooltip?: string
}

const ColoredActionIcon = forwardRef<HTMLButtonElement, Props>(
  (
    {
      color,
      toggledColor,
      activeVariant = 'light',
      activeColor = `${color}.4`,
      tooltip,
      children,
      ...props
    },
    ref
  ) => {
    const icon = (
      <ActionIconExtended
        ref={ref}
        color="gray.5"
        activeColor={activeColor}
        activeVariant={activeVariant}
        hoverColor={color}
        hoverVariant="filled"
        toggledColor={toggledColor}
        toggledVariant="outline"
        {...props}
      >
        {children}
      </ActionIconExtended>
    )

    return tooltip ? <Tooltip label={tooltip}>{icon}</Tooltip> : icon
  }
)

export default ColoredActionIcon
