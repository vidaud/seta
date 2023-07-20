import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  padding: 6px;
  transition: all 200ms ${theme.transitionTimingFunction};
`

export const noTransition = css`
  transition: none;
`
