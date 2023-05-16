import { css } from '@emotion/react'

const HEIGHT = 30

export const root: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  font-size: ${theme.fontSizes.sm};
  position: absolute;
  top: 0;
  right: 4px;
  height: ${HEIGHT}px;
  z-index: -10;
  opacity: 0;
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;

  &.has-tokens {
    // translate3d runs on the GPU
    transform: translate3d(0, -${HEIGHT}px, 0);
    opacity: 1;
  }
`

export const tokens: ThemedCSS = theme => css`
  color: ${theme.colors.blue[6]};
  margin-right: 4px;
`
