import { Tooltip, ActionIcon, Group } from '@mantine/core'
import { IconCheck, IconBan } from '@tabler/icons-react'

type Props = {
  onApprove?(): void
  onReject?(): void
}

const RowActions = ({ onApprove, onReject }: Props) => {
  return (
    <Group noWrap>
      <Tooltip label="Approve">
        <ActionIcon variant="outline" color="blue" onClick={onApprove}>
          <IconCheck stroke={1.5} size="md" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Reject">
        <ActionIcon variant="outline" color="yellow" onClick={onReject}>
          <IconBan stroke={1.5} size="md" />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

export default RowActions
