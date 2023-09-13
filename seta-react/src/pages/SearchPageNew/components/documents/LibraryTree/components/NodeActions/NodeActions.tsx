import { Suspense, lazy } from 'react'
import { Group, Tooltip } from '@mantine/core'

import { LibraryItemType } from '~/types/library/library-item'
import type { LibraryItem } from '~/types/library/library-item'

import NewFolderAction from '../NewFolderAction'
import RootActions from '../RootActions'

// Lazy load the options menu action to avoid rendering it and the confirmation modals when not needed
const OptionsMenuActionLazy = lazy(() => import('../OptionsMenuAction'))

type Props = {
  item: LibraryItem
  isRoot?: boolean
  noActionsMenu?: boolean
  onCreatingNewFolder?: () => void
  onNewFolderCreated?: (folderId: string) => void
  onNewFolderPopoverChange?: (open: boolean) => void
  onOptionsMenuChange?: (open: boolean) => void
  onCollapseAllFolders?: () => void
}

const NodeActions = ({
  item,
  isRoot,
  noActionsMenu,
  onCreatingNewFolder,
  onNewFolderCreated,
  onNewFolderPopoverChange,
  onOptionsMenuChange,
  onCollapseAllFolders
}: Props) => {
  const hasActionMenu = !isRoot && !noActionsMenu
  const isFolder = item.type === LibraryItemType.Folder

  const rootActions = isRoot && <RootActions onCollapseAll={onCollapseAllFolders} />

  const folderActions = isFolder && (
    <NewFolderAction
      parent={item}
      onPopoverChange={onNewFolderPopoverChange}
      onCreatingNewFolder={onCreatingNewFolder}
      onNewFolderCreated={onNewFolderCreated}
    />
  )

  return (
    <div data-actions>
      <Group spacing={2} ml="sm">
        <Tooltip.Group openDelay={300} closeDelay={200}>
          {rootActions}
          {folderActions}

          {hasActionMenu && (
            <Suspense fallback={null}>
              <OptionsMenuActionLazy item={item} onMenuChange={onOptionsMenuChange} />
            </Suspense>
          )}
        </Tooltip.Group>
      </Group>
    </div>
  )
}

export default NodeActions
