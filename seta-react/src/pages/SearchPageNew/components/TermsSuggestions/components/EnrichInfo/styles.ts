import { css } from '@emotion/react'

export const root = css`
  flex: 0.8;
`

export const container: ThemedCSS = theme => css`
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray[1]};
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[4]};
  line-height: 0;
`

export const content: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};

  & div:first-of-type {
    color: ${theme.colors.gray[8]};
    font-size: ${theme.fontSizes.lg};
    margin-bottom: 2px;
  }
`
