import { css } from '@emotion/react'
import { createStyles } from '@mantine/core'

export const useStyles = createStyles(() => ({
  page: {
    [`@media only screen     
      and (min-device-width : 1024px) 
      and (max-device-width : 1366px) 
      and (orientation : portrait) 
      and (-webkit-min-device-pixel-ratio: 2)`]: { width: '85%' },
    [`@media only screen and (min-width: 800px) and (max-width: 1666px) and (orientation : landscape)`]:
      { width: '80%' },
    [`@media only screen and (max-width: 912px) and (orientation : portrait)`]: { width: '80%' },
    [`@media only screen and (max-width: 710px) and (orientation : portrait)`]: { width: '89%' },
    [`@media only screen and (max-width: 712px) and (orientation : portrait)`]: { width: '73%' },
    [`@media only screen and (max-width: 480px) and (orientation : portrait)`]: { width: '90%' },
    [`@media only screen and (max-width: 412px) and (orientation : portrait)`]: { width: '88%' },
    [`@media only screen and (max-width: 320px) and (orientation : portrait)`]: { width: '85%' },
    [`@media only screen and (max-width: 1366px) and (orientation : landscape)`]: { width: '85%' },
    [`@media only screen and (max-width: 1280px) and (orientation : landscape)`]: { width: '85%' },
    [`@media only screen and (max-width: 1024px) and (orientation : landscape)`]: { width: '85%' },
    [`@media only screen and (max-width: 800px) and (orientation : landscape)`]: { width: '85%' },
    [`@media only screen and (max-width: 640px) and (orientation : landscape)`]: { width: '75%' },
    [`@media only screen and (max-width: 600px) and (orientation : landscape)`]: { width: '85%' },
    [`@media only screen and (max-width: 540px) and (orientation : landscape)`]: { width: '85%' },
    [`@media (min-width: 90em)`]: {
      width: '85%'
    }
  }
}))

export const root: ThemedCSS = () => css`
  width: 100%;
`
