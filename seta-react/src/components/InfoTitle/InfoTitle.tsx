import type { ReactNode } from 'react'
import { Group, Text, Tooltip } from '@mantine/core'
import type { TooltipBaseProps } from '@mantine/core/lib/Tooltip/Tooltip.types'
import { IconInfoCircle } from '@tabler/icons-react'

import * as S from './styles'

type TooltipOptions = {
  width?: TooltipBaseProps['width']
  multiline?: TooltipBaseProps['multiline']
  withinPortal?: TooltipBaseProps['withinPortal']
  position?: TooltipBaseProps['position']
  zIndex?: TooltipBaseProps['zIndex']
}

type Props = {
  children: ReactNode
  tooltip?: ReactNode
  tooltipOptions?: TooltipOptions
}

const InfoTitle = ({ children, tooltip, tooltipOptions }: Props) => {
  return (
    <Group spacing="0.5rem">
      <Text fz="lg">{children}</Text>

      {tooltip && (
        <Tooltip label={tooltip} {...tooltipOptions}>
          <IconInfoCircle css={S.info} />
        </Tooltip>
      )}
    </Group>
  )
}

export default InfoTitle
