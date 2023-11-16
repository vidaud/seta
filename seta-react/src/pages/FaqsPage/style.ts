import { createStyles, getStylesRef, rem } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    minHeight: rem(820),
    position: 'relative',
    color: theme.black
  },

  title: {
    color: theme.black,
    fontSize: 52,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  },

  control: {
    fontSize: theme.fontSizes.lg,
    borderRadius: theme.radius.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    color: theme.black,
    backgroundColor: theme.colors.gray[1],
    fontWeight: 200
  },

  content: {
    paddingLeft: theme.spacing.xl,
    lineHeight: 1.6,
    color: theme.black
  },

  icon: {
    ref: getStylesRef('icon'),
    marginLeft: theme.spacing.md
  },

  gradient: {
    backgroundImage: `radial-gradient(${theme.colors[theme.primaryColor][6]} 0%, ${
      theme.colors[theme.primaryColor][5]
    } 100%)`
  },

  itemOpened: {
    [`& .${getStylesRef('icon')}`]: {
      transform: 'rotate(45deg)'
    }
  },

  button: {
    display: 'block',
    marginTop: theme.spacing.md,

    [theme.fn.smallerThan('sm')]: {
      display: 'block',
      width: '100%'
    }
  }
}))
