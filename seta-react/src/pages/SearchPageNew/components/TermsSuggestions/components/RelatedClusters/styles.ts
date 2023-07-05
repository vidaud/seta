import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  margin-left: -${theme.spacing.sm};
  margin-right: -${theme.spacing.sm};
  padding-left: ${theme.spacing.sm};
  padding-right: ${theme.spacing.sm};
`
