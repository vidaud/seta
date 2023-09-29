import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  text: {
    [`@media (max-width: 89em)`]: {
      width: '60%'
    },
    [`@media (min-width: 90em)`]: {
      width: '70%'
    }
  },
  row: {
    '&:hover': {
      background: '#f8f9fa',
      cursor: 'pointer'
    }
  },
  badge: {
    '&:hover': {
      color: 'green'
    }
  },
  button: {
    marginBottom: theme.spacing.xs
  }
}))
