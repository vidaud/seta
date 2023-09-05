import { css } from '@emotion/react'

export const root = css`
  .seta-Modal-body {
    min-width: 30rem;
  }
`

export const redStar: ThemedCSS = theme => css`
  color: ${theme.colors.red[5]};
  align-self: flex-start;
`
