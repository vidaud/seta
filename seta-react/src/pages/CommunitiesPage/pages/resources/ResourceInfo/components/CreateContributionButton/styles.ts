import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  ${theme.fn.fontStyles()}// padding: ${theme.spacing.xs} ${theme.spacing.sm};
`
