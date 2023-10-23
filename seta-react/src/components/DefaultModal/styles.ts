import { css } from '@emotion/react'
import { createStyles, getStylesRef } from '@mantine/core'

export const modalStyles = createStyles(theme => ({
  header: {
    ref: getStylesRef('header'),
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
    transition: `box-shadow 200ms ${theme.transitionTimingFunction}`,
    zIndex: 1002,

    '.seta-CloseButton-root': {
      transform: 'scale(1.2)'
    }
  },

  title: {
    display: 'flex',
    flex: 1
  },

  root: {
    [`&[data-scrolled='true'] .${getStylesRef('header')}`]: {
      boxShadow: theme.shadows.sm,
      borderBottomColor: theme.colors.gray[4]
    }
  },

  content: {
    maxHeight: 'initial',
    display: 'grid',
    gridTemplateRows: 'auto 1fr'
  },

  body: {
    padding: 0,
    display: 'grid',
    gridTemplateRows: '1fr auto',
    overflow: 'hidden',
    maxHeight: '75vh'
  }
}))

export const root = css`
  .seta-Modal-inner {
    left: 0;
  }

  &[data-fullscreen='true'] {
    .seta-Modal-body {
      max-height: 100vh;
    }

    .seta-Modal-content {
      flex-basis: 100vw;

      .seta-ScrollArea-root {
        max-height: 100vh;
      }
    }
  }
`

export const scrollArea: ThemedCSS = theme => css`
  min-height: 0;
  overflow: hidden;
  background-color: ${theme.colors.gray[0]};

  .seta-ScrollArea-root {
    max-height: 60vh;

    .seta-ScrollArea-scrollbar {
      z-index: 10;

      &[data-state='visible'] {
        &:hover {
          background-color: ${theme.fn.rgba(theme.colors.gray[3], 0.8)};
        }
      }
    }
  }
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: 1.5rem;
  min-width: 1.5rem;
  line-height: 0;
`

export const content: ThemedCSS = theme => css`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  min-height: 14rem;
  background-color: ${theme.colors.gray[0]};
`

export const actions: ThemedCSS = theme => css`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.gray[3]};
`
