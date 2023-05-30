import { css } from '@emotion/react'

export const icon = css`
  line-height: 0;
`

export const errorIcon: ThemedCSS = theme => css`
  color: ${theme.colors.red[5]};
`
