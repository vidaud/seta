import { css } from '@emotion/react'

export const pageWrapper = css`
  padding: 2rem;
`

export const inputWrapper: ThemedCSS = theme => css`
  width: 66%;
  padding: ${theme.spacing.sm};
`
