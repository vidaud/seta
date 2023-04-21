import { css } from '@emotion/react'

export const pageWrapper = css`
  padding: 3rem 2rem;
`

export const inputWrapper: ThemedCSS = theme => css`
  width: 66%;
  padding: ${theme.spacing.sm};
`
