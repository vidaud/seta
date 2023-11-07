import { css } from '@emotion/react'

export const scopeRow: ThemedCSS = theme => css`
  &.selected {
    background-color: ${theme.fn.rgba(theme.colors.gray[3], 0.4)};
  }

  &.elevated {
    font-weight: 700;
  }
`
