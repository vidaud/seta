import { css } from '@emotion/react'

export const actions: ThemedCSS = theme => css`
  padding-left: calc(${theme.spacing.xs} / 2);
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
  padding-left: calc(${theme.spacing.xs} / 2 + ${theme.spacing.xl});
`

export const docs: ThemedCSS = theme => css`
  padding-top: ${theme.spacing.md};
`

export const scrollArea: ThemedCSS = theme => css`
  ${marginPadding(theme)}
`
