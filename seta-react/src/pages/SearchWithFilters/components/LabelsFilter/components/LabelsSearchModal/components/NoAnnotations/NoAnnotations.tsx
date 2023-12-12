import type { ReactNode } from 'react'
import { Group, Text } from '@mantine/core'
import { IconTagOff } from '@tabler/icons-react'

import Color from '~/components/Color'

type Props = {
  message: ReactNode
  icon?: ReactNode
}

const NoAnnotations = ({ message, icon = <IconTagOff size={32} /> }: Props) => {
  return (
    // Negative margin to compensate the grid gap in the parent component
    <Group mx="auto" mt="-1rem">
      <Color color="gray.6">{icon}</Color>

      <Text size="md" color="gray.6">
        {message}
      </Text>
    </Group>
  )
}

export default NoAnnotations
