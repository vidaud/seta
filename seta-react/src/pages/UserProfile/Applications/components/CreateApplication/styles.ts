import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  ${theme.fn.fontStyles()}
  // padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: '1px solid #868e96';
`
