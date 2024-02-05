import { css } from '@emotion/react'
import styled from '@emotion/styled'
import type { ActionIconProps } from '@mantine/core'
import { ActionIcon, createPolymorphicComponent } from '@mantine/core'

import type { Color, Variant } from '~/types/lib-props'
import { transientProps } from '~/utils/styled-utils'

type Props = ActionIconProps & {
  $hoverColor: Color
  $hoverVariant?: Variant
  $toggledColor?: Color
  $toggledVariant?: Variant
}

const _StyledActionIcon = styled(
  ActionIcon,
  transientProps
)<Props>(
  ({ theme, variant, color, $hoverVariant, $hoverColor, $toggledColor, $toggledVariant }) => {
    const variantValue = variant?.toString() ?? 'subtle'

    const hoverColors = theme.fn.variant({
      variant: $hoverVariant?.toString() ?? variantValue,
      color: $hoverColor ?? color
    })

    const toggledColors = theme.fn.variant({
      variant:
        $toggledVariant === 'outline' ? 'light' : $toggledVariant?.toString() ?? variantValue,
      color: $toggledColor ?? color
    })

    const baseTransition = `color 200ms ${theme.transitionTimingFunction},
      background-color 200ms ${theme.transitionTimingFunction},
      opacity 200ms ${theme.transitionTimingFunction},
      visibility 200ms ${theme.transitionTimingFunction},
      margin 200ms ${theme.transitionTimingFunction},
      width 200ms ${theme.transitionTimingFunction}`

    return {
      position: 'relative',

      '&:not(:focus)': {
        transition: baseTransition
      },

      '&:focus': {
        transition: `outline-color 100ms ease, outline-offset 100ms ease, ${baseTransition}`
      },

      '&:hover, &:focus:focus-visible': {
        color: hoverColors.color,
        backgroundColor: hoverColors.background
      },

      '&[data-toggled]:not(:hover)': {
        backgroundColor: toggledColors.background
      }
    }
  }
)

// ActionIcon is a polymorphic component, so we need to use `createPolymorphicComponent` to properly type it.
// See https://mantine.dev/core/action-icon/#polymorphic-component and https://mantine.dev/styles/styled/#polymorphic-components
export const StyledActionIcon = createPolymorphicComponent<'button', Props>(_StyledActionIcon)

export const iconWrapper = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`
