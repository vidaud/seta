import { css } from '@emotion/react'

export const removeIcon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  font-size: 3.2rem;
`

export const actions: ThemedCSS = theme => css`
  transition: box-shadow 0.2s ${theme.transitionTimingFunction},
    margin 0.2s ${theme.transitionTimingFunction}, padding 0.2s ${theme.transitionTimingFunction};
`
const marginPadding: ThemedCSS = theme => css`
  margin-left: -${theme.spacing.xl};
  margin-right: -${theme.spacing.xl};
  padding-left: ${theme.spacing.xl};
  padding-right: ${theme.spacing.xl};
`

export const withShadow: ThemedCSS = theme => css`
  box-shadow: ${theme.shadows.sm};
  z-index: 1;

  ${marginPadding(theme)}
`

export const scrollArea: ThemedCSS = theme => css`
  ${marginPadding(theme)}
`
