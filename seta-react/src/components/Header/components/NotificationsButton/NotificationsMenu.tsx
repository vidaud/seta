import { Menu, ActionIcon } from '@mantine/core'
import { IoMdNotifications } from 'react-icons/io'

import type { NotificationsResponse } from '~/api/types/notifications-types'

import NotificationsDropdown from './NotificationsDropdown'

import type { DropdownItem } from '../../config'
import { itemIsCollapse } from '../../config'
import * as S from '../../styles'

type Props = {
  dropdownItems: DropdownItem[]
  notifications?: NotificationsResponse[]
  total?: number
}

const NotificationsMenu = ({ dropdownItems, notifications, total }: Props) => {
  // eslint-disable-next-line array-callback-return
  const notificationsMenuItems = dropdownItems.map((item, index) => {
    if (itemIsCollapse(item)) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <NotificationsDropdown notifications={notifications} key={index} />
      )
    }
  })

  return (
    <Menu shadow="md" width={280} position="bottom-end">
      <Menu.Target>
        <ActionIcon css={(S.dropdownTarget, S.action)} color="gray.1" size="xl" radius="xl">
          <IoMdNotifications size="2rem" />
        </ActionIcon>
      </Menu.Target>

      {total && total > 0 ? (
        <Menu.Dropdown title="Notifications" css={S.notificationsDropdown}>
          {notificationsMenuItems}
        </Menu.Dropdown>
      ) : null}
    </Menu>
  )
}

export default NotificationsMenu
