import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Collapse, Flex, Tooltip } from '@mantine/core'

import ChevronToggleIcon from '~/components/ChevronToggleIcon'

import type { ClassNameProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

import NodeActions from './components/NodeActions'
import { ROOT_ICON, FOLDER_ICON_OPEN, FOLDER_ICON, FILE_ICON } from './constants'
import { useDocumentsTree } from './contexts/documents-tree-context'
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

  const { title, type, path } = item

  const isDisabled = useMemo(() => disabledIds?.includes(item.id), [disabledIds, item.id])

  const isFolder = type === LibraryItemType.Folder

  const selectedStyle = selected?.id === item.id && S.selected
  const editingStyle = (isEditing || isLoading) && S.editing
  const disabledStyle = isDisabled && S.disabled

  const itemStyle = [S.itemContainer, selectedStyle, editingStyle, disabledStyle]

  useEffect(() => {
    if (willSelectId) {
      selectChildRef.current(item, willSelectId)

      setWillSelectId(null)
    }
  }, [willSelectId, item, type])

  const handleTitleClick = () => {
    if (isDisabled) {
      return
    }

    if (isFolder) {
      setIsExpanded(prev => !prev)
    }

    if (selectable) {
      if (toggleable) {
        const isAlreadySelected = selected?.id === item.id
        const itemValue = isAlreadySelected ? undefined : item

        onSelect?.(itemValue)

        return
      }

      if (selected?.id !== item.id) {
        onSelect?.(item)
      }
    }
  }

  const handleCreatingNewFolder = () => {
    setIsLoading(true)

    if (isExpanded && !children.length) {
      setIsExpanded(false)
    }
  }

  const handleNewFolderCreated = (folderId: string) => {
    setIsLoading(false)
    setIsExpanded(true)

    if (selectable) {
      setWillSelectId(folderId)
    }
  }

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

  const content = isFolder && (
    <Collapse in={isExpanded}>
      {children.map(child => (
        <LibraryNode key={child.id} item={child} />
      ))}
    </Collapse>
  )

  const toggleIcon = isFolder && (
    <ChevronToggleIcon start="right" end="down" size="sm" toggled={isExpanded} css={S.toggleIcon} />
  )

  const icon = isRoot
    ? ROOT_ICON
    : isFolder
    ? isExpanded
      ? FOLDER_ICON_OPEN
      : FOLDER_ICON
    : FILE_ICON

  const actionsGroup = (
    <NodeActions
      item={item}
      isRoot={isRoot}
      noActionsMenu={noActionMenu}
      onCreatingNewFolder={handleCreatingNewFolder}
      onNewFolderCreated={handleNewFolderCreated}
      onNewFolderPopoverChange={setIsEditing}
      onOptionsMenuChange={setIsEditing}
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
        <div css={itemStyle} onClick={handleTitleClick}>
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
