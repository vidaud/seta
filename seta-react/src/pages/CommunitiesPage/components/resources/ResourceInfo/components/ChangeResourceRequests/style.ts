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
    [`@media only screen and (max-width: 912px) and (orientation: portrait)`]: {
      marginTop: '5%'
    },
    [`@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 2)`]:
      {
        marginTop: '2%'
      },
    [`@media only screen and (max-width: 712px) and (orientation: portrait)`]: {
      marginTop: '11%'
    },
    [`@media only screen and (max-width: 590px) and (orientation: portrait)`]: {
      marginTop: '20%'
    },
    [`@media only screen and (max-width: 1024px) and (orientation : landscape)`]: {
      marginTop: '4%'
    },
    [`@media only screen and (max-width: 640px) and (orientation : landscape)`]: {
      marginTop: '10%'
    },
    [`@media only screen and (min-width: 642px) and (max-width: 1280px) and (orientation: landscape)`]:
      {
        marginTop: '2%'
      }
  },
  input: {
    [`@media only screen and (max-width: 640px)`]: {
      width: '70%'
    }
  }
}))
