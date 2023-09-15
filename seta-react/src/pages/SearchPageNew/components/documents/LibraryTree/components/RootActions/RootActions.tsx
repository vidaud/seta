import { Group, Tooltip } from '@mantine/core'
import { FaChevronUp } from 'react-icons/fa'

import ColoredActionIcon from '~/components/ColoredActionIcon'

type Props = {
  onCollapseAll?: () => void
}

const RootActions = ({ onCollapseAll }: Props) => {
  return (
    <Group spacing={2}>
      <Tooltip label="Collapse all folders">
        <ColoredActionIcon color="gray" onClick={onCollapseAll}>
          <FaChevronUp size={18} />
        </ColoredActionIcon>
      </Tooltip>
    </Group>
  )
}

export default RootActions
