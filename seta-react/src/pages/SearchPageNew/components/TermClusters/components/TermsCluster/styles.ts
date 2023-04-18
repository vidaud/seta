import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  border-top: dashed 1px ${theme.colors.gray[3]};
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  cursor: pointer;

  &:first-of-type {
    border-top: 0;
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};
    border-color: transparent;
  }

  &:hover + & {
    border-color: transparent;
  }
`

export const chip: ThemedCSS = theme => css`
  .seta-Chip-label {
    color: ${theme.colors.dark[6]};

    &[data-checked='true'] {
      color: white;
      background-color: ${theme.colors.teal[6]};

      .seta-Chip-iconWrapper {
        color: white;
      }
    }
  }
`
