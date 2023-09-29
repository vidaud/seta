import { Badge, Center, Group, Text } from '@mantine/core'
import moment from 'moment'

import type { AccountDetail } from '~/types/admin/user-info'

type Props = {
  details?: AccountDetail
}

const AccountDetails = ({ details }: Props) => {
  const rsaKey = (
    <Badge color={details?.hasRsaKey ? 'teal' : 'gray'}>{details?.hasRsaKey ? 'Yes' : 'No'}</Badge>
  )

  const lastActive = details?.lastActive ? new Date(details?.lastActive) : new Date()
  const dateStr = moment.utc(lastActive).local().format('YYYY-MM-DD HH:mm')

  return (
    <Center>
      <Group p={10} position="center">
        <Text fw={500} c="dimmed" size="sm">
          Rsa key?
        </Text>
        <Text fw={600}>{rsaKey}</Text>
      </Group>
      <Group p={10} position="center">
        <Text fw={500} c="dimmed" size="sm">
          Applications
        </Text>
        <Text fw={600}>{details?.appsCount}</Text>
      </Group>
      <Group p={10} position="center">
        <Text fw={500} c="dimmed" size="sm">
          Last active
        </Text>
        <Text fw={600}>{details?.lastActive ? dateStr : 'Unknown'}</Text>
      </Group>
    </Center>
  )
}

export default AccountDetails
