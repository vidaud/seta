import type { ReactElement } from 'react'
import { useState } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import {
  Indicator,
  Box,
  Collapse,
  Flex,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

import type { ClassAndChildrenProps } from '~/types/children-props'

import * as S from './styles'

type Props = ClassAndChildrenProps & {
  icon?: ReactElement
  color?: DefaultMantineColor
  marker?: DefaultMantineColor | boolean | null
  title: string
  open?: boolean
  disabled?: boolean
}

const ToggleSection = ({
  className,
  children,
  icon,
  color,
  title,
  marker,
  open,
  disabled
}: Props) => {
  const [isOpen, setIsOpen] = useState(open ?? false)

  const openValue = !disabled && isOpen

  const handleToggle = () => {
    setIsOpen(current => !current)
  }

  const withMarker = (content: JSX.Element) => {
    if (!marker) {
      return content
    }

    const markerColor: DefaultMantineColor = typeof marker === 'boolean' ? 'blue' : marker

    return (
      <Indicator css={S.marker} color={markerColor} size={8} disabled={openValue}>
        {content}
      </Indicator>
    )
  }

  return (
    <Box className={className} css={S.root} data-open={openValue}>
      <UnstyledButton
        css={S.button}
        onClick={handleToggle}
        data-open={openValue}
        disabled={disabled}
      >
        <Group position="apart" spacing={0}>
          <Flex align="center">
            <ThemeIcon variant={openValue ? 'filled' : 'outline'} color={color}>
              {icon}
            </ThemeIcon>

            {withMarker(
              <Text fz="md" fw={500} ml="md">
                {title}
              </Text>
            )}
          </Flex>

          <IconChevronRight css={S.chevron} size="1.5rem" stroke={1.5} data-open={openValue} />
        </Group>
      </UnstyledButton>

      <Collapse css={S.content} in={openValue}>
        {children}
      </Collapse>
    </Box>
  )
}

export default ToggleSection
