import { Group, Tooltip } from '@mantine/core'
import { FaChevronUp } from 'react-icons/fa'

import ColoredActionIcon from '~/components/ColoredActionIcon'

type Props = {
  isLibraryEmpty?: boolean
  onCollapseAll?: () => void
}

const RootActions = ({ isLibraryEmpty, onCollapseAll }: Props) => {
  const collapseAll = !isLibraryEmpty && (
    <Tooltip label="Collapse all folders">
      <ColoredActionIcon color="gray" onClick={onCollapseAll}>
        <FaChevronUp size={18} />
      </ColoredActionIcon>
    </Tooltip>
  )

  return <Group spacing={2}>{collapseAll}</Group>
}

export default RootActions
