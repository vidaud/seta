import { css } from '@emotion/react'

export const root = css`
  position: relative;
`

export const quote: ThemedCSS = theme => css`
  position: absolute;
  line-height: 0;
  color: ${theme.colors.gray[3]};

  &.left {
    left: -8px;
    top: -8px;
  }

  &.right {
    right: -8px;
    bottom: -6px;
  }
`

export const text = css`
  white-space: pre-wrap;
  text-align: justify;
`

export { Container } from '../../styles'
