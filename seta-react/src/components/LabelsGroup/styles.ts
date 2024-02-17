import { css } from '@emotion/react'

import { focusStyles, outlineTransition } from '~/styles'
import { fadeIn } from '~/styles/keyframe-animations'

export const group: ThemedCSS = theme => css`
  position: relative;
  padding: ${theme.spacing.sm} 0;
  border-radius: ${theme.radius.md};

  & span.highlight {
    margin-top: 0;
    margin-bottom: 0;
  }

  &:first-of-type {
    border-top: 0;
  }
`

export const selectable: ThemedCSS = theme => css`
  padding: ${theme.spacing.sm};
  transition: ${outlineTransition};
  cursor: pointer;

  &:hover + &,
  &:focus:focus-visible + & {
    border-color: transparent;
  }

  ${focusStyles(theme)}

  &:active:not(:focus-within) {
    transition: none;
    transform: translateY(0.0625rem);
  }

  &:focus:focus-visible {
    outline-offset: -0.18rem;
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};
    border-color: transparent;
  }
`

export const withSeparator: ThemedCSS = theme => css`
  & + &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -${theme.spacing.xs};
    right: -${theme.spacing.xs};
    height: 1px;
    background-color: ${theme.colors.gray[2]};
  }
`

export const removeHint: ThemedCSS = theme => css`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -${theme.spacing.sm};
    right: -${theme.spacing.sm};
    background-color: ${theme.fn.rgba(theme.colors.red[5], 0.2)};
    border-radius: ${theme.radius.md};
    pointer-events: none;
    animation: ${fadeIn} 200ms ${theme.transitionTimingFunction};
  }
`

export const groupTitle: ThemedCSS = theme => css`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray[6]};
  font-weight: 500;
  line-height: 1;
`
