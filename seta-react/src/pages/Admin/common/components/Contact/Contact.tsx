import { Box, Text, Group } from '@mantine/core'
import { IconAt, IconUser } from '@tabler/icons-react'
import { IoMdLink } from 'react-icons/io'

type Props = {
  person?: string
  website?: string
  email?: string
}

const EmailGroup = ({ email }: Props) => {
  if (!email) {
    return null
  }

  return (
    <Group noWrap spacing={3} mt={3}>
      {email ? <IconAt stroke={1.5} size="1rem" color="gray" /> : null}
      <Text fz="sm">{email}</Text>
    </Group>
  )
}

const ContactInfo = ({ person, website, email }: Props) => {
  return (
    <Box>
      <Group noWrap spacing={3}>
        {person ? <IconUser size="1rem" color="gray" /> : null}
        <Text fz="sm">{person ?? 'unknown'}</Text>
      </Group>

      <Group noWrap spacing={3}>
        {website ? <IoMdLink size="1rem" color="gray" /> : null}
        <Text fz="sm">{website}</Text>
      </Group>

      <EmailGroup email={email} />
    </Box>
  )
}

export default ContactInfo
