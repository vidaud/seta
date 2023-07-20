import type { MantineThemeOverride } from '@mantine/core'

import { growX } from '~/styles/keyframe-animations'

const globalStyles: MantineThemeOverride['globalStyles'] = theme => ({
  'span.highlight': {
    position: 'relative',
    padding: '0 1px',
    margin: '1px -1px',
    display: 'inline-block',
    zIndex: 1,
    transition: 'color 300ms ease',
    color: theme.colors.orange[9],

    '&:before': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundColor: theme.fn.rgba(theme.fn.lighten(theme.colors.yellow[4], 0.25), 0.4),
      borderRadius: theme.radius.sm,
      zIndex: -1,
      transformOrigin: 'left center',
      transform: 'scaleX(0)',
      animation: `${growX} 300ms 100ms ease forwards`
    }
  },

  // Override the default button focus styles for Firefox
  'button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring':
    {
      outline: `0.125rem solid ${theme.colors[theme.primaryColor][5]}`
    },

  '.pinnable': {
    position: 'sticky',
    top: -1,
    zIndex: 10
  }
})

export default globalStyles
