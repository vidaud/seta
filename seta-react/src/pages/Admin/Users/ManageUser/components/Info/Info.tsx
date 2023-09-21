import { Anchor, Badge, Box, Group, SimpleGrid, Text } from '@mantine/core'
import moment from 'moment'

import { AccountStatus } from '~/types/admin/user-info'
import { UserRole } from '~/types/user'

type Props = {
  username?: string
  email?: string
  role?: UserRole
  status?: AccountStatus
  createdAt?: Date
  lastModifiedAt?: Date
}

const Label = ({ label }) => {
  return (
    <Text size="md" c="dimmed">
      {label}
    </Text>
  )
}

const DateFiled = ({ dt }) => {
  const date = moment.utc(dt).local().format('YYYY-MM-DD')
  const time = moment.utc(dt).local().format('HH:mm')

  return (
    <Group spacing="0.2rem">
      <Text>{date}</Text>
      <Text c="dimmed">{time}</Text>
    </Group>
  )
}

const Info = ({ username, email, role, status, createdAt, lastModifiedAt }: Props) => {
  const roleColor = role === UserRole.Administrator ? 'orange.4' : 'cyan.3'
  const statusColor = status === AccountStatus.Active ? 'blue.3' : 'dark.3'

  return (
    <SimpleGrid cols={3}>
      <Box>
        <Label label="Identifier" />
        <Text>{username}</Text>
      </Box>
      <Box>
        <Label label="Email" />
        <Anchor component="button" size="sm">
          {email}
        </Anchor>
      </Box>
      <Box>
        <Label label="Created at" />
        {createdAt && <DateFiled dt={createdAt} />}
      </Box>
      <Box>
        <Label label="Role" />
        <Badge color={roleColor}>{role}</Badge>
      </Box>
      <Box>
        <Label label="Status" />
        <Badge color={statusColor}>{status}</Badge>
      </Box>
      <Box>
        <Label label="Last modified" />
        {lastModifiedAt && <DateFiled dt={lastModifiedAt} />}
        {!lastModifiedAt && '-'}
      </Box>
    </SimpleGrid>
  )
}

export default Info
