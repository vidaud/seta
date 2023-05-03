import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  padding-bottom: ${theme.spacing.sm};
  margin-left: ${theme.spacing.sm};
  margin-right: calc(${theme.spacing.lg} * 2);
`

export const termChip = css`
  font-weight: 600;

  .seta-Chip-label[data-checked] {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .seta-Chip-iconWrapper {
      display: none;
    }
  }
`
