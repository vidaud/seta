import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: 600,
    boxSizing: 'border-box',
    padding: `calc(${theme.spacing.xl} * 3.5)`,

    [theme.fn.smallerThan('sm')]: {
      padding: `calc(${theme.spacing.xl} * 2.5)`
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.black,
    lineHeight: 1
  },

  description: {
    color: theme.colors[theme.primaryColor][6],

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%'
    }
  },

  form: {
    backgroundColor: theme.white
  }
}))
