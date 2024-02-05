import { Stack, Text } from '@mantine/core'
import { IconTagOff } from '@tabler/icons-react'

import useThemeColor from '~/hooks/use-theme-color'

const NoLabelsSelected = () => {
  const { getThemeColor } = useThemeColor()

  return (
    <Stack align="center" spacing="sm" p="xs">
      <IconTagOff color={getThemeColor('gray.5')} />

      <Text size="sm" color="gray.7">
        No annotations selected
      </Text>
    </Stack>
  )
}

export default NoLabelsSelected
