import { Badge, Box, Group, Space, Text } from '@mantine/core'
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
    <Box>
      <Group>
        <Text fw={500}>Rsa key?:</Text>
        <Text fw={700}>{rsaKey}</Text>
      </Group>
      <Space h="sm" />
      <Group>
        <Text fw={500}>Applications:</Text>
        <Text fw={700}>{details?.appsCount}</Text>
      </Group>
      <Space h="sm" />
      <Group>
        <Text fw={500}>Last active:</Text>
        <Text fw={700}>{details?.lastActive ? dateStr : 'Unknown'}</Text>
      </Group>
    </Box>
  )
}

export default AccountDetails
