import { css, keyframes } from '@emotion/react'

const itemKeyframes = keyframes({
  from: {
    padding: 0
  },

  to: {
    padding: '0 6px'
  }
})

export const item: ThemedCSS = theme => css`
  color: ${theme.colors.gray[7]};

  & + &::before {
    content: '•';
    display: inline-block;
    color: ${theme.colors.gray[5]};
    transition: all 200ms ${theme.transitionTimingFunction};
    animation: ${itemKeyframes} 300ms ease forwards;
  }
`

export const taxonomyRoot: ThemedCSS = theme => css`
  & + & {
    margin-top: ${theme.spacing.sm};
  }
`
