import { css } from '@emotion/react'

export const divider: ThemedCSS = theme => css`
  transition: margin 0.2s ${theme.transitionTimingFunction},
    padding 0.2s ${theme.transitionTimingFunction};

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    transition: box-shadow 0.2s ${theme.transitionTimingFunction};
  }
`

const marginPadding: ThemedCSS = theme => css`
  margin-left: -${theme.spacing.sm};
  margin-right: -${theme.spacing.sm};
  padding-left: ${theme.spacing.sm};
  padding-right: ${theme.spacing.sm};
`

export const withShadow: ThemedCSS = theme => css`
  z-index: 1;
  position: relative;
  ${marginPadding(theme)}

  &::before {
    box-shadow: ${theme.shadows.sm};
  }
`
