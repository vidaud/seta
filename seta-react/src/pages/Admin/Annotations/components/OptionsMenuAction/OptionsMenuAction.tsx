import React, { useState } from 'react'
import { ActionIcon, Menu, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiCornerRightDown, FiCornerUpRight } from 'react-icons/fi'

import ActionIconMenu from '~/components/ActionIconMenu/ActionIconMenu'

import type { AnnotationResponse } from '~/api/types/annotations-types'

import * as S from './styles'

import { downLoadJSON } from '../../downloadJson'
import ImportContainer from '../ImportContainer'

type Props = {
  item?: AnnotationResponse
  data?: AnnotationResponse[]
  isLoading?: boolean
}

const OptionsMenuAction = ({ item, data, isLoading }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [opened, setOpened] = useState(false)

  const closePopup = () => {
    setOpened(false)
  }

  return (
    <ActionIconMenu
      position="right"
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
      closeOnClickOutside={opened ? false : true}
    >
      {data ? (
        <>
          <Menu.Item
            icon={<FiCornerUpRight />}
            onClick={() => {
              downLoadJSON(JSON.stringify(data), 'application/json', `annotations.json`)
            }}
          >
            Export all annotations
          </Menu.Item>
          <Popover
            position="bottom"
            withinPortal
            width="30%"
            withArrow
            arrowSize={16}
            shadow="sm"
            offset={10}
            opened={opened}
            onChange={setOpened}
          >
            <Popover.Target>
              <Menu.Item icon={<FiCornerRightDown />} onClick={() => setOpened(o => !o)}>
                Import annotations
              </Menu.Item>
            </Popover.Target>

            <Popover.Dropdown css={S.popup} className="flex">
              <ImportContainer />

              <ActionIcon
                variant="light"
                size="md"
                radius="sm"
                css={S.closeButton}
                onClick={closePopup}
              >
                <IconX size={20} strokeWidth={3} />
              </ActionIcon>
            </Popover.Dropdown>
          </Popover>
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
