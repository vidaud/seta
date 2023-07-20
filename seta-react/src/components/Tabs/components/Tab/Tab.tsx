import type { ReactElement, ReactNode } from 'react'
import type {
  DefaultMantineColor,
  MantineNumberSize,
  SpacingValue,
  SystemProp,
  ThemeIconProps
} from '@mantine/core'
import { Group, Tabs, ThemeIcon } from '@mantine/core'

import { useCurrentTab } from '~/components/Tabs/contexts/tabs-context'

import * as S from './styles'

type Props = {
  value: string
  icon?: ReactElement
  color?: DefaultMantineColor
  label: ReactNode
  spacing?: MantineNumberSize
  padding?: SystemProp<SpacingValue>
}

const Tab = ({ value, icon, label, padding, color = 'gray.5', spacing = 'sm' }: Props) => {
  const isActive = useCurrentTab() === value

  const iconVariant: ThemeIconProps['variant'] = isActive ? 'filled' : 'outline'
  const iconColor: DefaultMantineColor = isActive ? color : 'gray.5'

  const iconEl = icon && (
    <ThemeIcon css={S.iconWrapper} variant={iconVariant} color={iconColor}>
      {icon}
    </ThemeIcon>
  )

  return (
    <Tabs.Tab value={value}>
      <Group spacing={spacing} p={padding}>
        {iconEl}
        {label}
      </Group>
    </Tabs.Tab>
  )
}

export default Tab
