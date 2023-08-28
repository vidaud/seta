import { css, keyframes } from '@emotion/react'

const selectedActionsEntry = keyframes({
  from: {
    transform: 'translateX(-1rem)',
    opacity: 0
  },
  to: {
    transform: 'translateX(0)',
    opacity: 1
  }
})

const defaultActionsEntry = keyframes({
  from: {
    transform: 'translateX(1rem)',
    opacity: 0
  },
  to: {
    transform: 'translateX(0)',
    opacity: 1
  }
})

export const root: ThemedCSS = theme => css`
  height: 4rem;
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.gray[3]};
`

export const info: ThemedCSS = theme => css`
  svg {
    font-size: 1.2rem;
    color: ${theme.colors.gray[5]};
  }
`

export const defaultActions: ThemedCSS = theme => css`
  animation: ${defaultActionsEntry} 200ms ${theme.transitionTimingFunction};
`

export const selectedActions: ThemedCSS = theme => css`
  animation: ${selectedActionsEntry} 200ms ${theme.transitionTimingFunction};
`
