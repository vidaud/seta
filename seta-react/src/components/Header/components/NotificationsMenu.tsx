import { Badge, Menu, Group, Box, ActionIcon } from '@mantine/core'
import { IoMdNotifications } from 'react-icons/io'

import { useStyles } from '~/pages/SearchWithFilters/components/ApplyFilters/styles'

import type { NotificationsResponse } from '~/api/types/notifications-types'

import NotificationsDropdown from './NotificationsDropdown'

import type { DropdownItem } from '../config'
import { itemIsCollapse } from '../config'
import * as S from '../styles'

type Props = {
  total: number
  dropdownItems: DropdownItem[]
  notifications: NotificationsResponse[]
}

const NotificationsMenu = ({ total, dropdownItems, notifications }: Props) => {
  const { classes } = useStyles()

  // FIXME: This needs to be fixed - Array.map should always return a value
  const notificationsMenuItems = dropdownItems.map((item, index) => {
    if (itemIsCollapse(item)) {
      return (
        // FIXME: We should try to avoid using index as a key when possible - see https://adhithiravi.medium.com/why-do-i-need-keys-in-react-lists-dbb522188bbb
        // eslint-disable-next-line react/no-array-index-key
        <Menu.Item key={index}>
          <Group position="apart" spacing={0} sx={{ paddingBottom: '1rem' }} w="98%">
            <IoMdNotifications size="1.3rem" />
            <Box className={classes.box}>Notifications</Box>
            <Badge variant="filled" size="xs">
              {total}
            </Badge>
          </Group>
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

      <Menu.Dropdown css={S.dropdown}>{notificationsMenuItems}</Menu.Dropdown>
    </Menu>
  )
}

export default NotificationsMenu
