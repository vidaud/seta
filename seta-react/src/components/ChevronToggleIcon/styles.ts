import { css } from '@emotion/react'

export const chevron: ThemedCSS = theme => css`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ${theme.transitionTimingFunction};
`

export const downStart = css`
  transform: rotate(0deg);
`

export const downEnd = css`
  &[data-toggled='true'] {
    transform: rotate(0deg);
  }
`

export const upStart = css`
  transform: rotate(180deg);
`

export const upEnd = css`
  &[data-toggled='true'] {
    transform: rotate(180deg);
  }
`

export const leftStart = css`
  transform: rotate(90deg);
`

export const leftEnd = css`
  &[data-toggled='true'] {
    transform: rotate(90deg);
  }
`

export const rightStart = css`
  transform: rotate(270deg);
`

export const rightEnd = css`
  &[data-toggled='true'] {
    transform: rotate(270deg);
  }
`
