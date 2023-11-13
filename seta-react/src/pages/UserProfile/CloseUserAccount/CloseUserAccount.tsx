import { Alert, Card, Group, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

import DeleteUser from '../Profile/components/DeleteUser'

const CloseUserAccount = () => {
  return (
    <Card shadow="xs" padding="lg" radius="sm" mt={15}>
      <Alert icon={<IconAlertCircle size="1rem" />} title="Warning!" color="orange">
        <Text>Are you sure you want to close your account? </Text>You'll lose everything:
        <ul>
          <li>Username</li>
          <li>Your communities and resources</li>
          <li>Access to other's communities and resources</li>
          <li>Invitations or membership requests</li>
        </ul>
        <Text>
          Notice: Your account will be saved for a short period. You will not be able to recreate
          the account until it is fully deleted after the retention period.
        </Text>
      </Alert>
      <Text ta="center" pt="md">
        If you are sure, confirm by clicking the button below.
      </Text>
      <Group position="center" pt="md">
        <DeleteUser />
      </Group>
    </Card>
  )
}

export default CloseUserAccount
