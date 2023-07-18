import { Text, Badge, Collapse } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { useStyles } from '../../../pages/SearchWithFilters/components/ApplyFilters/styles'

const NotificationsDropdown = ({ isOpen, notifications }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const items = notifications.map(link => (
    <div key={link.label} className={classes.group}>
      <Badge sx={{ marginTop: '2px' }} variant="filled" size="xs">
        {link.count}
      </Badge>
      <Text<'a'>
        component="a"
        className={classes.link}
        onClick={() => {
          navigate(
            link.type === 'pending-invite'
              ? '/invites'
              : link.type === 'membership-request'
              ? '/membership-requests'
              : ''
            // : '/change-request'
          )
        }}
        key={link.label}
      >
        {link.label}
      </Text>
    </div>
  ))

  return <Collapse in={isOpen}>{items}</Collapse>
}

export default NotificationsDropdown
