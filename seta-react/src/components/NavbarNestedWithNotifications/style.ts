import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    [`@media only screen     
      and (min-device-width : 1024px) 
      and (max-device-width : 1366px) 
      and (orientation : portrait) 
      and (-webkit-min-device-pixel-ratio: 2)`]: { width: '15%' },
    [`@media only screen and (min-width: 800px) and (max-width: 1666px) and (orientation : landscape)`]:
      { width: '20%' },
    [`@media only screen and (max-width: 912px) and (orientation : portrait)`]: { width: '20%' },
    [`@media only screen and (max-width: 710px) and (orientation : portrait)`]: { width: '11%' },
    [`@media only screen and (max-width: 712px) and (orientation : portrait)`]: { width: '27%' },
    [`@media only screen and (max-width: 480px) and (orientation : portrait)`]: { width: '10%' },
    [`@media only screen and (max-width: 412px) and (orientation : portrait)`]: { width: '12%' },
    [`@media only screen and (max-width: 320px) and (orientation : portrait)`]: { width: '15%' },
    [`@media only screen and (max-width: 1366px) and (orientation : landscape)`]: { width: '15%' },
    [`@media only screen and (max-width: 1280px) and (orientation : landscape)`]: { width: '15%' },
    [`@media only screen and (max-width: 1024px) and (orientation : landscape)`]: { width: '15%' },
    [`@media only screen and (max-width: 800px) and (orientation : landscape)`]: { width: '15%' },
    [`@media only screen and (max-width: 640px) and (orientation : landscape)`]: { width: '25%' },
    [`@media only screen and (max-width: 600px) and (orientation : landscape)`]: { width: '15%' },
    [`@media only screen and (max-width: 540px) and (orientation : landscape)`]: { width: '15%' },
    [`@media (min-width: 90em)`]: {
      width: '15%'
    }
  }
}))
