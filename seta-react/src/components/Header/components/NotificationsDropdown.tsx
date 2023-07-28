import { Text, Badge, Box } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { useStyles } from '~/pages/SearchWithFilters/components/ApplyFilters/styles'

import type { NotificationsResponse } from '~/api/types/notifications-types'

type Props = {
  notifications: NotificationsResponse[]
}

const NotificationsDropdown = ({ notifications }: Props) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const items = notifications
    .sort((a, b) => a.priority - b.priority)
    .map(link => (
      <div key={link.label} className={classes.group}>
        <Text<'a'>
          component="a"
          className={link.priority === 1 ? classes.priority : classes.link}
          onClick={() => {
            navigate(
              link.type === 'pending-invite'
                ? '/community/invites'
                : link.type === 'membership-request'
                ? '/community/membership-requests'
                : '/admin'
            )
          }}
          key={link.label}
        >
          {link.label}
        </Text>
        <Badge sx={{ marginTop: '2px' }} variant="filled" size="xs">
          {link.count}
        </Badge>
      </div>
    ))

  return <Box>{items}</Box>
}

export default NotificationsDropdown
