import type { ReactNode } from 'react'
import { Flex } from '@mantine/core'

import InfoTitle from '~/components/InfoTitle'

type Props = {
  title: ReactNode
  tooltip?: ReactNode
  children?: ReactNode
}

const SelectSectionTitle = ({ title, tooltip, children }: Props) => {
  return (
    <Flex justify="space-between" align="center">
      <InfoTitle tooltip={tooltip}>{title}</InfoTitle>

      {children}
    </Flex>
  )
}

export default SelectSectionTitle
