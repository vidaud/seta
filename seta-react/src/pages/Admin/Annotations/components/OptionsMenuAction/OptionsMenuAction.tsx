import { useState } from 'react'
import { Menu } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiCornerRightDown, FiCornerUpRight } from 'react-icons/fi'

import ActionIconMenu from '~/components/ActionIconMenu/ActionIconMenu'

import type { AnnotationResponse } from '~/api/types/annotations-types'

import { downLoadJSON } from '../../downloadJson'
import AddAnnotation from '../AddAnnotation'

type Props = {
  item?: AnnotationResponse
  data?: AnnotationResponse[]
  isLoading?: boolean
}

const OptionsMenuAction = ({ item, data, isLoading }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ActionIconMenu
      closeOnItemClick={false}
      action={{
        icon: <BsThreeDotsVertical size={18} strokeWidth={0.5} />,
        color: 'gray.7',
        tooltip: 'Actions',
        loading: isLoading,
        active: isLoading,
        onClick: () => setIsOpen(true)
      }}
      opened={isOpen}
      closeOnClickOutside={false}
    >
      {data ? (
        <>
          <Menu.Item icon={<IconPlus size="1.1rem" />}>
            <AddAnnotation />
          </Menu.Item>
          <Menu.Item
            icon={<FiCornerUpRight />}
            onClick={() => {
              downLoadJSON(JSON.stringify(data), 'application/json', `annotations.json`)
            }}
          >
            Export annotations
          </Menu.Item>
          <Menu.Item
            icon={<FiCornerRightDown />}
            onClick={() => {
              // downLoadJSON(JSON.stringify(item), 'application/json', `${item.label}-annotation.json`)
            }}
          >
            Import annotations
          </Menu.Item>
        </>
      ) : null}
      {item ? (
        <Menu.Item
          icon={<FiCornerUpRight />}
          onClick={() => {
            downLoadJSON(JSON.stringify(item), 'application/json', `${item.label}-annotation.json`)
          }}
        >
          Export annotation
        </Menu.Item>
      ) : null}
    </ActionIconMenu>
  )
}

export default OptionsMenuAction
