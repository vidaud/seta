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

export const operator: ThemedCSS = theme => css`
  font-weight: 600;
  padding: 0.25rem ${theme.spacing.sm};

  span {
    color: ${theme.colors.gray[6]};
  }

  &[data-operator='AND'] {
    color: ${theme.colors.grape[6]};
    background-color: ${theme.colors.grape[0]};
  }

  &[data-operator='OR'] {
    color: ${theme.colors.blue[6]};
    background-color: ${theme.colors.blue[0]};
  }
`
