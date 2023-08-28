import type { MouseEventHandler } from 'react'
import { ActionIcon, Checkbox, Group, Text, Tooltip } from '@mantine/core'
import { CgFileDocument } from 'react-icons/cg'
import { MdClose } from 'react-icons/md'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import * as S from './styles'

type Props = {
  document: StagedDocument
  selected?: boolean
  onSelectChange?: (selected: boolean) => void
  onRemove?: () => void
}

const StagedDocInfo = ({ document, selected, onSelectChange, onRemove }: Props) => {
  const { title } = document

  const handleSelect = () => {
    onSelectChange?.(!selected)
  }

  const handleRemove: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    onRemove?.()
  }

  return (
    <div css={S.root} onClick={handleSelect}>
      <Checkbox css={S.checkbox} color="teal" checked={selected} onChange={handleSelect} />

      <Group spacing="xs">
        <CgFileDocument css={S.icon} />

        <Text size="lg" style={{ flex: 1 }} truncate>
          {title}
        </Text>
      </Group>

      <Tooltip label="Remove from staged documents">
        <ActionIcon variant="subtle" color="gray" data-action="remove" onClick={handleRemove}>
          <MdClose />
        </ActionIcon>
      </Tooltip>
    </div>
  )
}

export default StagedDocInfo
