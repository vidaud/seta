import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  align-self: stretch;
  position: sticky;
  top: ${theme.spacing.sm};
  z-index: 100;
`
