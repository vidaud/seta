import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  height: 3rem;
  padding: 0 ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray[2]};
  margin-bottom: 3rem;
  color: ${theme.colors.gray[7]};
`

export const link: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
`
