import { Badge, Box, Menu } from '@mantine/core'
import { IconGitPullRequest, IconMessages } from '@tabler/icons-react'
import { FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { useStyles } from '~/pages/SearchWithFilters/components/ApplyFilters/styles'

import type { NotificationsResponse } from '~/api/types/notifications-types'

type Props = {
  notifications?: NotificationsResponse[]
}

const NotificationsDropdown = ({ notifications }: Props) => {
  const { classes } = useStyles()
  const items = notifications
    ?.sort((a, b) => a.priority - b.priority)
    .map(link => (
      // eslint-disable-next-line react/no-array-index-key

      <Menu.Item
        pb="xs"
        className={link.priority === 1 ? classes.priority : classes.link}
        style={{ display: 'flex' }}
        key={link.label}
        component={Link}
        icon={
          link.type === 'pending-invite' ? (
            <IconMessages size="1rem" />
          ) : link.type === 'membership-request' ? (
            <FiUsers size="1rem" />
          ) : (
            <IconGitPullRequest size="1rem" color={link.priority === 1 ? '#4169e1' : undefined} />
          )
        }
        to={
          link.type === 'pending-invite'
            ? '/community/invites'
            : link.type === 'membership-request'
            ? '/community/membership-requests'
            : '/admin'
        }
      >
        {link.label}
        <Badge sx={{ marginTop: '2px', float: 'right' }} variant="filled" size="xs" ml="2%">
          {link.count}
        </Badge>
      </Menu.Item>
    ))

  return <Box>{items}</Box>
}

export default NotificationsDropdown
