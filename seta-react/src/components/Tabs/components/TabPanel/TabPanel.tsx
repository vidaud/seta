import { Tabs } from '@mantine/core'

import type { ClassAndChildrenProps } from '~/types/children-props'

import * as S from './styles'

type Props = {
  value: string
} & ClassAndChildrenProps

const TabPanel = ({ value, className, children }: Props) => {
  return (
    <Tabs.Panel css={S.root} value={value} className={className}>
      <div css={S.content}>{children}</div>
    </Tabs.Panel>
  )
}

export default TabPanel
