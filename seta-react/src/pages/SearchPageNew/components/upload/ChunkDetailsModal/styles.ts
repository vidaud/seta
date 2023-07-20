import { css } from '@emotion/react'

export const textView: ThemedCSS = theme => css`
  white-space: pre-wrap;
  padding: 0 ${theme.spacing.sm};
  color: ${theme.colors.gray[9]};
`
