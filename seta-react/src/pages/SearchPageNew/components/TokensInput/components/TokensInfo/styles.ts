import { css } from '@emotion/react'

const HEIGHT = 29

export const item: ThemedCSS = theme => css`
  position: absolute;
  top: 0;
  right: ${theme.spacing.md};
  height: ${HEIGHT}px;
  z-index: -10;
  opacity: 0;
  padding: 0 ${theme.spacing.xs};
  color: ${theme.colors.gray[6]};
  background-color: ${theme.colors.gray[1]};
  border-top-left-radius: ${theme.radius.sm};
  border-top-right-radius: ${theme.radius.sm};
  border: solid 1px ${theme.colors.gray[3]};
  border-bottom-style: none;
  box-shadow: inset 0 1px 2px ${theme.white};
  font-size: ${theme.fontSizes.sm};
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, margin 0.2s ease-in-out;

  &[data-visible='true'] {
    // translate3d runs on the GPU
    transform: translate3d(0, -${HEIGHT}px, 0);
    opacity: 1;
  }

  &[data-visible='true'] + & {
    margin-right: 3rem;
  }
`

export const tokens: ThemedCSS = theme => css`
  color: ${theme.colors.gray[7]};
  margin-right: 4px;
`

export const enrichedIcon = css`
  width: 20px;
  height: 20px;
`
