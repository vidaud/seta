import { Group, Tooltip } from '@mantine/core'

import { LibraryItemType } from '~/types/library/library-item'
import type { LibraryItem } from '~/types/library/library-item'

import NewFolderAction from '../NewFolderAction'
import OptionsMenuAction from '../OptionsMenuAction'

type Props = {
  item: LibraryItem
  isRoot?: boolean
  noActionsMenu?: boolean
  isNewFolderLoading?: boolean
  isOptionsMenuLoading?: boolean
  onNewFolder?: (name: string) => void
  onNewFolderPopoverChange?: (open: boolean) => void
  onOptionsMenuChange?: (open: boolean) => void
}

const NodeActions = ({
  item,
  isRoot,
  noActionsMenu,
  isNewFolderLoading,
  onNewFolderPopoverChange,
  onOptionsMenuChange,
  onNewFolder
}: Props) => {
  const hasActionMenu = !isRoot && !noActionsMenu
  const isFolder = item.type === LibraryItemType.Folder

  return (
    <div data-actions>
      <Group spacing={2} ml="sm">
        <Tooltip.Group openDelay={300} closeDelay={200}>
          {isFolder && (
            <NewFolderAction
              isLoading={isNewFolderLoading}
              onPopoverChange={onNewFolderPopoverChange}
              onNewFolder={onNewFolder}
            />
          )}

          {hasActionMenu && <OptionsMenuAction item={item} onMenuChange={onOptionsMenuChange} />}
        </Tooltip.Group>
      </Group>
    </div>
  )
}

export default NodeActions
