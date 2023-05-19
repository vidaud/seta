import type { MantineThemeOverride } from '@mantine/core'

import componentOverrides from './component-overrides'
import globalStyles from './global-styles'

export const theme: MantineThemeOverride = {
  other: {
    jrcBlue: '#004494'
  },

  components: componentOverrides,
  globalStyles: globalStyles
}
