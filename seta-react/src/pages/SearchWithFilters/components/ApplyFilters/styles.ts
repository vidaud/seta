import { css } from '@emotion/react'
import type { MantineTheme } from '@mantine/core'
import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => {
  const borderColor = theme.colors.gray[4]

  return {
    dropdown: {
      borderColor
    },

    arrow: {
      borderColor
    },

    chevron: {
      transition: 'transform 200ms ease'
    },

    group: {
      display: 'flex',
      gap: '0.5rem'
    },

    link: {
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
      }
    },

    priority: {
      color: '#4169e1',
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
      }
    },

    box: {
      fontSize: '0.875rem',
      marginLeft: '-2rem'
    }
  }
})

const getTransition = (theme: MantineTheme) =>
  [
    `color 200ms ${theme.transitionTimingFunction}`,
    `background-color 200ms ${theme.transitionTimingFunction}`,
    `border-color 200ms ${theme.transitionTimingFunction}`
  ].join(', ')

export const indicator: ThemedCSS = theme => css`
  transition: ${getTransition(theme)};
`

export const button: ThemedCSS = theme => css`
  transition: ${getTransition(theme)};
`

export const buttonInactive: ThemedCSS = theme => css`
  && {
    background-color: ${theme.colors.gray[0]};
    border-color: ${theme.colors.blue[4]};
    border-style: dashed;
  }
`
