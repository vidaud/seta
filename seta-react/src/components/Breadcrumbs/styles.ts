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
  transition: color 0.2s ${theme.transitionTimingFunction};

  &:hover {
    color: ${theme.colors.blue[7]};
  }
`

export const linkActive: ThemedCSS = theme => css`
  color: ${theme.colors.gray[8]};
  pointer-events: none;
`

export const breadcrumbs: ThemedCSS = theme => css`
  .mantine-Breadcrumbs-separator {
    margin: 0 ${theme.spacing.sm};
    color: ${theme.colors.gray[4]};
  }
`
