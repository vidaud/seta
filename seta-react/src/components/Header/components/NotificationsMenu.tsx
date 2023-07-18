import { Badge, Menu, Group, Box, ChevronIcon, ActionIcon } from '@mantine/core'
import { IoMdNotifications } from 'react-icons/io'

import NotificationsDropdown from './NotificationsDropdown'

import { useStyles } from '../../../pages/SearchWithFilters/components/ApplyFilters/styles'
import { itemIsCollapse } from '../config'
import * as S from '../styles'

const NotificationsMenu = ({ isOpen, total, dropdownItems, notifications, onChange }) => {
  const { classes, theme } = useStyles()

  const notificationsMenuItems = dropdownItems.map((item, index) => {
    if (itemIsCollapse(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Menu.Item key={index} onClick={() => onChange(o => !o)}>
          <Group position="apart" spacing={0} sx={{ paddingBottom: '1rem' }}>
            <IoMdNotifications size="1.3rem" />
            <Box className={classes.box}>Notifications</Box>
            <Badge variant="filled" size="xs">
              {total}
            </Badge>
            {total > 0 ? (
              <ChevronIcon
                className={classes.chevron}
                style={{
                  transform: !isOpen ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none'
                }}
              />
            ) : (
              <div />
            )}
          </Group>
          <NotificationsDropdown isOpen={isOpen} notifications={notifications} />
        </Menu.Item>
      )
    }
  })

  return (
    <Menu shadow="md" width={200} position="bottom-end" closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon css={(S.dropdownTarget, S.action)} color="gray.1" size="xl" radius="xl">
          <IoMdNotifications size="1.3rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown css={S.dropdown}>{notificationsMenuItems}</Menu.Dropdown>
    </Menu>
  )
}

export default NotificationsMenu
