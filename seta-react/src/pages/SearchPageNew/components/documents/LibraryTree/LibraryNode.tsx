import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Flex, Tooltip } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

import NodeActions from './components/NodeActions'
import { useDocumentsTree } from './contexts/documents-tree-context'
import { useRootActions } from './contexts/root-actions-context'
import useNodeContent from './hooks/use-node-content'
import useNodeEvents from './hooks/use-node-events'
import * as S from './styles'

type Props = {
  item: LibraryItem
  isRoot?: boolean
} & ClassNameProp

const LibraryNode = ({ className, item, isRoot }: Props) => {
  const [isExpanded, setIsExpanded] = useState(isRoot ?? false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Store the id of the newly created folder to select after a rerender
  const [willSelectId, setWillSelectId] = useState<string | null>(null)

  const {
    foldersOnly,
    selectable,
    toggleable,
    disabledIds,
    disabledBadge,
    noActionMenu,
    selected,
    onSelect,
    selectChild
  } = useDocumentsTree()

  const selectChildRef = useRef(selectChild)

  const { registerIsExpandedSetter, unregisterIsExpandedSetter, collapseAllFolders } =
    useRootActions()

  const { id, title, type, path } = item

  const isDisabled = useMemo(() => disabledIds?.includes(item.id), [disabledIds, item.id])

  const isFolder = type === LibraryItemType.Folder

  const selectedStyle = selected?.id === item.id && S.selected
  const editingStyle = (isEditing || isLoading) && S.editing
  const disabledStyle = isDisabled && S.disabled

  const itemStyle = [S.itemContainer, selectedStyle, editingStyle, disabledStyle]

  const children = useMemo(() => {
    if (isDisabled) {
      return []
    }

    return isFolder
      ? foldersOnly
        ? item.children.filter(({ type: t }) => t === LibraryItemType.Folder)
        : item.children
      : []
  }, [item, isFolder, isDisabled, foldersOnly])

  const showTopActions = !!isRoot && isExpanded && !children.length

  const folderContent = children.map(child => <LibraryNode key={child.id} item={child} />)

  const {
    handleTitleClick,
    handleCreatingNewFolder,
    handleNewFolderCreated,
    handleCollapseAllFolders
  } = useNodeEvents({
    item,
    children,
    selectable,
    toggleable,
    isRoot,
    isFolder,
    isDisabled,
    isExpanded,
    selected,
    onSelect,
    setWillSelectId,
    setIsExpanded,
    setIsLoading,
    collapseAllFolders
  })

  const { content, icon, toggleIcon } = useNodeContent({
    isFolder,
    isRoot,
    isExpanded,
    foldersOnly,
    folderContent
  })

  useEffect(() => {
    if (isRoot) {
      return
    }

    // Register/unregister the isExpanded setter when the node is expanded/collapsed
    if (isExpanded) {
      registerIsExpandedSetter(id, setIsExpanded)
    } else {
      unregisterIsExpandedSetter(id)
    }
  }, [isExpanded, id, isRoot, registerIsExpandedSetter, unregisterIsExpandedSetter])

  useEffect(() => {
    if (willSelectId) {
      selectChildRef.current(item, willSelectId)

      setWillSelectId(null)
    }
  }, [willSelectId, item, type])

  const actionsGroup = (
    <NodeActions
      item={item}
      isRoot={isRoot}
      noActionsMenu={noActionMenu}
      onCreatingNewFolder={handleCreatingNewFolder}
      onNewFolderCreated={handleNewFolderCreated}
      onNewFolderPopoverChange={setIsEditing}
      onOptionsMenuChange={setIsEditing}
      onCollapseAllFolders={handleCollapseAllFolders}
    />
  )

  const movingThis = isDisabled && !!disabledBadge && (
    <Badge color="teal" radius="sm" variant="filled">
      {disabledBadge}
    </Badge>
  )

  return (
    <div css={S.node} className={className}>
      <Tooltip
        label={path.join(' / ')}
        openDelay={1000}
        withinPortal
        classNames={S.tooltipStyles().classes}
        disabled
      >
        <div
          css={itemStyle}
          data-top-actions={showTopActions || undefined}
          onClick={handleTitleClick}
        >
          {toggleIcon}
          <div css={S.icon}>{icon}</div>

          <Flex align="center" justify="space-between" css={S.titleContainer}>
            <div css={S.title}>{title}</div>

            {actionsGroup}
            {movingThis}
          </Flex>
        </div>
      </Tooltip>

      {content}
    </div>
  )
}

export default LibraryNode
