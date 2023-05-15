import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  ${theme.fn.fontStyles()}
  margin-top: '20px';
`
