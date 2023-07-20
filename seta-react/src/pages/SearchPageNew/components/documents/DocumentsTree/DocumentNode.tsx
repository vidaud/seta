import { useEffect, useMemo, useRef, useState } from 'react'
import { Collapse, Flex, Group, Tooltip } from '@mantine/core'

import ChevronToggleIcon from '~/components/ChevronToggleIcon'

import type { ClassNameProp } from '~/types/children-props'
import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

import NewFolderAction from './components/NewFolderAction'
import { ROOT_ICON, FOLDER_ICON_OPEN, FOLDER_ICON, FILE_ICON } from './constants'
import { useDocumentsTree } from './contexts/documents-tree-context'
import * as S from './styles'

type Props = {
  item: LibraryItem
  isRoot?: boolean
} & ClassNameProp

const DocumentNode = ({ className, item, isRoot }: Props) => {
  const [isExpanded, setIsExpanded] = useState(isRoot ?? false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Store the id of the newly created folder to select after a rerender
  const [willSelectId, setWillSelectId] = useState<string | null>(null)

  const { foldersOnly, selectable, toggleable, selected, onSelect, selectChild, createNewFolder } =
    useDocumentsTree()

  const selectChildRef = useRef(selectChild)

  const { title, type, path } = item

  const isFolder = type === LibraryItemType.Folder

  const selectedStyle = selected?.id === item.id && S.selected
  const editingStyle = (isEditing || isLoading) && S.editing
  const itemStyle = [S.itemContainer, selectedStyle, editingStyle]

  useEffect(() => {
    if (willSelectId) {
      selectChildRef.current(item, willSelectId)

      setWillSelectId(null)
    }
  }, [willSelectId, item, type])

  const handleTitleClick = () => {
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

  const handleNewFolder = async (name: string) => {
    if (isExpanded && !children.length) {
      setIsExpanded(false)
    }

    setIsLoading(true)

    const newId = await createNewFolder?.(item.id === 'root' ? null : item.id, name)

    setIsLoading(false)
    setIsExpanded(true)

    if (selectable) {
      setWillSelectId(newId)
    }
  }

  const children = useMemo(
    () =>
      isFolder
        ? foldersOnly
          ? item.children.filter(({ type: t }) => t === LibraryItemType.Folder)
          : item.children
        : [],
    [item, isFolder, foldersOnly]
  )

  const content = isFolder && (
    <Collapse in={isExpanded}>
      {children.map(child => (
        <DocumentNode key={child.id} item={child} />
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
    <Group spacing="xs" ml="sm" data-actions>
      {isFolder && (
        <NewFolderAction
          isLoading={isLoading}
          onPopoverChange={setIsEditing}
          onNewFolder={handleNewFolder}
        />
      )}
    </Group>
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
          </Flex>
        </div>
      </Tooltip>

      {content}
    </div>
  )
}

export default DocumentNode
