import type { MantineThemeOverride } from '@mantine/core'

const componentOverrides: MantineThemeOverride['components'] = {
  Chip: {
    styles: {
      root: {
        '&:active': {
          transform: 'translateY(0.0625rem)'
        }
      }
    }
  },

  Tooltip: {
    defaultProps: {
      openDelay: 200
    }
  }
}

export default componentOverrides
