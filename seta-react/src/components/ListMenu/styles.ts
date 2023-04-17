import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  &:not(:hover) .selected {
    background-color: ${theme.colors.gray[1]};
  }
`
