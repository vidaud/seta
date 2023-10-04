import { useState } from 'react'
import { Menu } from '@mantine/core'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { BsBoxArrowInUpRight, BsThreeDotsVertical } from 'react-icons/bs'
import { FiCornerUpRight } from 'react-icons/fi'

import ActionIconMenu from '~/components/ActionIconMenu/ActionIconMenu'
import { useTreeActions } from '~/pages/SearchPageNew/components/documents/LibraryTree/contexts/tree-actions-context'

import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

type Props = {
  item: LibraryItem
  isLoading?: boolean
  onMenuChange?: (open: boolean) => void
}

const OptionsMenuAction = ({ item, isLoading, onMenuChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const { renameFolder, confirmDelete, moveItem } = useTreeActions()

  const isFolder = item.type === LibraryItemType.Folder
  const subject = isFolder ? 'folder' : 'document'

  return (
    <ActionIconMenu
      action={{
        icon: <BsThreeDotsVertical size={18} strokeWidth={0.5} />,
        color: 'gray.7',
        tooltip: 'Actions',
        loading: isLoading,
        active: isLoading,
        onClick: () => setIsOpen(true)
      }}
      opened={isOpen}
      onChange={onMenuChange}
      onOpen={() => onMenuChange?.(true)}
      onClose={() => onMenuChange?.(false)}
    >
      {isFolder && (
        <Menu.Item icon={<AiFillEdit />} onClick={() => renameFolder(item)}>
          Rename folder
        </Menu.Item>
      )}

      <Menu.Item
        icon={<BsBoxArrowInUpRight strokeWidth={0.5} size={16} />}
        onClick={() => moveItem(item)}
      >
        Move {subject}
      </Menu.Item>

      <Menu.Item icon={<AiFillDelete />} color="red" onClick={() => confirmDelete(item)}>
        {isFolder ? 'Delete folder' : 'Remove document'}
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item icon={<FiCornerUpRight />}>Export {isFolder ? 'documents' : 'document'}</Menu.Item>
    </ActionIconMenu>
  )
}

export default OptionsMenuAction
