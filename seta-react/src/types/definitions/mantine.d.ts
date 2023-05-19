import type { SerializedStyles } from '@emotion/react'
import type { MantineTheme } from '@mantine/core'

declare global {
  type ThemedCSS = (theme: MantineTheme) => SerializedStyles
}
