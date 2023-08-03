import { Box, Text, Group } from '@mantine/core'
import { IconAt, IconUser } from '@tabler/icons-react'

type Props = {
  username?: string
  fullName?: string
  email?: string
}

const EmailGroup = ({ email }: Props) => {
  if (!email) {
    return null
  }

  return (
    <Group noWrap spacing={3} mt={3}>
      <IconAt stroke={1.5} size="1rem" color="gray" />
      <Text fz="xs" c="dimmed">
        {email}
      </Text>
    </Group>
  )
}

const UserInfo = ({ username, fullName, email }: Props) => {
  return (
    <Box>
      <Text fz="md" fw={500}>
        {fullName ?? 'unknown'}
      </Text>

      <Group noWrap spacing={3}>
        <IconUser size="1rem" color="gray" />
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          {username}
        </Text>
      </Group>

      <EmailGroup email={email} />
    </Box>
  )
}

export default UserInfo
