import { Text, type DefaultMantineColor } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

// Read the version defined by Vite - see `vite.config.js`
const version = APP_VERSION

type Props = {
  color?: 'black' | 'white' | DefaultMantineColor
} & ClassNameProp

const Version = ({ color = 'dark', className }: Props) => {
  return (
    <Text size="xs" color={color} className={className}>
      v{version}
    </Text>
  )
}

export default Version
