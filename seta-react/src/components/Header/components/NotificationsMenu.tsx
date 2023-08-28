import { Menu, ActionIcon } from '@mantine/core'
import { IoMdNotifications } from 'react-icons/io'

import type { NotificationsResponse } from '~/api/types/notifications-types'

import NotificationsDropdown from './NotificationsDropdown'

import type { DropdownItem } from '../config'
import { itemIsCollapse } from '../config'
import * as S from '../styles'

type Props = {
  dropdownItems: DropdownItem[]
  notifications: NotificationsResponse[]
  total: number
}

const NotificationsMenu = ({ dropdownItems, notifications, total }: Props) => {
  // FIXME: This needs to be fixed - Array.map should always return a value
  const notificationsMenuItems = dropdownItems.map((item, index) => {
    if (itemIsCollapse(item)) {
      return (
        // FIXME: We should try to avoid using index as a key when possible - see https://adhithiravi.medium.com/why-do-i-need-keys-in-react-lists-dbb522188bbb
        // eslint-disable-next-line react/no-array-index-key
        <Menu.Item key={index}>
          <NotificationsDropdown notifications={notifications} />
        </Menu.Item>
      )
    }
  })

  return (
    <Menu shadow="md" width={220} position="bottom-end">
      <Menu.Target>
        <ActionIcon css={(S.dropdownTarget, S.action)} color="gray.1" size="xl" radius="xl">
          <IoMdNotifications size="2rem" />
        </ActionIcon>
      </Menu.Target>

      {total > 0 ? <Menu.Dropdown css={S.dropdown}>{notificationsMenuItems}</Menu.Dropdown> : null}
    </Menu>
  )
}

export default NotificationsMenu
