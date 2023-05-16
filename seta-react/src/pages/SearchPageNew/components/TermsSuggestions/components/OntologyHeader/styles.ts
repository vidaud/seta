import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  padding-bottom: ${theme.spacing.sm};
  margin-left: ${theme.spacing.sm};
  margin-right: calc(${theme.spacing.lg} * 2);
`

export const termChip: ThemedCSS = theme => css`
  font-weight: 600;

  .seta-Chip-label {
    transition: none;

    &[data-disabled] {
      background-color: ${theme.colors.gray[0]};
      border-color: ${theme.colors.gray[3]};
      color: ${theme.colors.gray[5]};
    }
  }
`
