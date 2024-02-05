import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { focusStyles, outlineTransition } from '~/styles'
import { transientProps } from '~/utils/styled-utils'

const COLOR_BAR_WIDTH = '7px'
const COLOR_BAR_SPACING = '2px'
const VERTICAL_SPACING = '0.2rem'
const VERTICAL_SPACING_SMALL = '0.1rem'
const HORIZONTAL_SPACING = '0.45rem'
const HORIZONTAL_PADDING = '0.75rem'

const BG_OPACITY = 0.03

type Props = {
  $color: string
  $selectable?: boolean
  $clearable?: boolean
}

export const LabelChip = styled(
  'div',
  transientProps
)<Props>(({ theme, $color, $selectable, $clearable }) => {
  const defaultStyle = theme.fn.variant({ variant: 'outline', color: 'gray.4' })
  const hoverStyle = theme.fn.variant({ variant: 'outline', color: 'gray.5' })

  const checkedStyle = theme.fn.variant({
    variant: 'filled',
    color: $selectable ? 'teal' : 'gray.5'
  })

  const defaultColor = theme.colors.dark[5]

  const bgColorDark = theme.fn.rgba($color, BG_OPACITY * 4)
  const bgColorLight = theme.fn.rgba($color, BG_OPACITY)

  const activeStyles = $selectable
    ? css`
        transition: none;
        transform: translateY(0.0625rem);
        background-color: ${bgColorDark};
        box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.4) inset;
      `
    : undefined

  const spacing = $selectable ? VERTICAL_SPACING : VERTICAL_SPACING_SMALL
  const fontSize = $selectable ? theme.fontSizes.sm : '13px'

  return css`
    display: flex;
    position: relative;
    align-items: center;
    gap: ${HORIZONTAL_SPACING};
    font-size: ${fontSize};
    color: ${theme.colors.dark[4]};
    background-color: ${theme.colors.gray[0]};
    box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.8) inset;
    border: 1px solid ${defaultStyle.border};
    padding: ${spacing} ${HORIZONTAL_PADDING};
    border-radius: ${theme.radius.sm};
    cursor: ${$selectable ? 'pointer' : 'default'};
    transition: all 100ms ${theme.transitionTimingFunction}, ${outlineTransition};

    /* Label's color */
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 0;
      left: ${COLOR_BAR_SPACING};
      top: ${COLOR_BAR_SPACING};
      bottom: ${COLOR_BAR_SPACING};
      border-radius: ${theme.radius.xs};
      background-color: ${$color};
      transition: all 100ms ${theme.transitionTimingFunction};
    }

    /* Border around the chip when it's selected */
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      border: 1px solid ${checkedStyle.background};
      border-radius: ${theme.radius.sm};
      background: transparent;
      pointer-events: none;
      opacity: 0;
      transition: opacity 200ms ${theme.transitionTimingFunction};
    }

    &:hover:not([aria-checked='true']) {
      border-color: ${hoverStyle.border};
    }

    ${focusStyles(theme)}

    &:focus {
      outline-offset: 0.2rem;
    }

    &&:active {
      ${activeStyles}
    }

    /* Selected state */
    &[aria-checked='true'] {
      padding-left: calc(${HORIZONTAL_PADDING} * 1.3);
      padding-right: ${$clearable ? '3px' : `calc(${HORIZONTAL_PADDING} * 0.7)`};
      background-color: ${bgColorLight};
      background: linear-gradient(90deg, ${bgColorDark}, ${bgColorLight} 35%);
      box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.2) inset;
      color: ${defaultColor};

      &::before {
        box-shadow: 0 0 2px 1px ${checkedStyle.color};
        width: ${COLOR_BAR_WIDTH};
      }

      &::after {
        opacity: 1;
      }
    }

    /* Clear button */
    .seta-ClearButton-root {
      outline-offset: -0.2rem;
      width: 1rem;
      min-width: 1rem;
      height: 1rem;
      min-height: 1rem;

      &:focus:focus-visible {
        outline-offset: 0;
      }
    }
  `
})
