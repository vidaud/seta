import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  height: 4rem;
  padding-bottom: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray[3]};
`

export const uploadIcon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[4]};
  font-size: 1.4rem;
`
