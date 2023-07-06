import { css } from '@emotion/react'
import { createStyles, getStylesRef } from '@mantine/core'

export const modalStyles = createStyles(theme => ({
  header: {
    ref: getStylesRef('header'),
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
    transition: `box-shadow 200ms ${theme.transitionTimingFunction}`
  },

  body: {
    padding: 0
  },

  root: {
    [`&[data-scrolled='true'] .${getStylesRef('header')}`]: {
      boxShadow: theme.shadows.sm
    }
  }
}))

export const scrollArea = css`
  .seta-ScrollArea-root {
    max-height: 60vh;
  }
`

export const textView: ThemedCSS = theme => css`
  white-space: pre-wrap;
  background-color: ${theme.colors.gray[1]};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin: ${theme.spacing.lg} ${theme.spacing.xl};
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: 1.5rem;
`
