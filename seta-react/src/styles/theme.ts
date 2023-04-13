import type { MantineThemeOverride } from '@mantine/core'

import componentOverrides from './component-overrides'

export const theme: MantineThemeOverride = {
  other: {
    jrcBlue: '#004494'
  },

  components: componentOverrides
}
