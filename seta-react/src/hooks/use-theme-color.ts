import type { DefaultMantineColor } from '@mantine/core'
import { useMantineTheme } from '@mantine/core'

const useThemeColor = () => {
  const theme = useMantineTheme()

  const getThemeColor = (color: DefaultMantineColor) => {
    // If the color is a shade, return that shade
    if (color.match(/\.\d$/)) {
      const [colorName, shade] = color.split('.')

      return theme.colors[colorName][Number(shade)]
    }

    return theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7]
  }

  return { getThemeColor }
}

export default useThemeColor
