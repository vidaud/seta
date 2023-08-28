import type { ComponentProps } from 'react'
import { forwardRef } from 'react'

import ActionIconExtended from '~/components/ActionIconExtended'

import type { Color } from '~/types/lib-props'

type Props = Omit<ComponentProps<typeof ActionIconExtended>, 'hoverColor' | 'hoverVariant'> & {
  toggledColor?: Color
}

const ColoredActionIcon = forwardRef<HTMLButtonElement, Props>(
  (
    {
      color,
      toggledColor,
      activeVariant = 'light',
      activeColor = `${color}.4`,
      children,
      ...props
    },
    ref
  ) => {
    return (
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
  }
)

export default ColoredActionIcon
