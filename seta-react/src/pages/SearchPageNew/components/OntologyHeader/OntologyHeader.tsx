import type { SegmentedControlItem } from '@mantine/core'
import { Space, ActionIcon, Checkbox, Flex, SegmentedControl, Tooltip } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import * as S from './styles'

const searchTypes: SegmentedControlItem[] = [
  { label: 'Related term clusters', value: 'clusters' },
  { label: 'Related terms', value: 'terms' }
]

const OntologyHeader = () => {
  return (
    <Flex css={S.root} align="center" justify="space-between" pb="sm">
      <Flex css={S.left} align="center" gap="sm">
        <Tooltip label="Select all">
          <Checkbox css={S.checkbox} size="md" />
        </Tooltip>

        <Tooltip label="Enrich query automatically">
          <ActionIcon size="lg">
            <IconWand />
          </ActionIcon>
        </Tooltip>
      </Flex>

      <SegmentedControl css={S.selector} data={searchTypes} />
      <Space />
    </Flex>
  )
}

export default OntologyHeader
