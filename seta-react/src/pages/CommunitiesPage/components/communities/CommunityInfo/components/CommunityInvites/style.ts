import { createStyles, rem } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`
    }
  },

  scrolled: {
    boxShadow: theme.shadows.sm
  },
  title: {
    paddingBottom: theme.spacing.xl
  },
  td: {
    whiteSpace: 'nowrap',
    maxWidth: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      cursor: 'pointer'
    }
  },
  table: {
    [`@media only screen and (max-width: 600px)`]: {
      marginTop: '10%'
    },
    [`@media only screen and (min-width: 610px) and (max-width: 820px)`]: {
      marginTop: '5%'
    }
  }
}))
