import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    transition: 'box-shadow 150ms ease',
    backgroundColor: 'white',
    '&::after': {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0
    }
  },
  scrolled: {
    boxShadow: theme.shadows.xs
  },
  scrolledH1: {
    boxShadow: theme.shadows.xs
  }
}))
