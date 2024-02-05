import type { MantineNumberSize, MantineStyleSystemProps } from '@mantine/core'
import { Alert, Text } from '@mantine/core'

import type { Variant } from './constants'
import { COLOR, ICON, TEXT, TITLE } from './constants'

type Props = MantineStyleSystemProps & {
  variant?: Variant
  text?: string
  radius?: MantineNumberSize
}

const UnderDevelopment = ({
  variant = 'under-development',
  text = TEXT[variant],
  radius = 'md',
  ...props
}: Props) => {
  const icon = ICON[variant]
  const color = COLOR[variant]
  const title = TITLE[variant]

  return (
    <Alert icon={icon} color={color} radius={radius} title={title} {...props}>
      <Text color="dark.4">{text}</Text>
    </Alert>
  )
}

export default UnderDevelopment
