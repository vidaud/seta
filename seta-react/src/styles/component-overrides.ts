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
  }
}

export default componentOverrides
