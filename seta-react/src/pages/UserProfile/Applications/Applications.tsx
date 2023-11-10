import { useState } from 'react'
import { Badge, Flex, Group, Paper, Text, Title } from '@mantine/core'
import { FiGrid } from 'react-icons/fi'

import ApplicationsList from './components/ApplicationsList'
import CreateApplication from './components/CreateApplication'

const Applications = () => {
  const [applicationsNR, setApplicationsNR] = useState<number>(0)

  const handleApplicationsNR = value => {
    setApplicationsNR(value)
  }

  return (
    <>
      <Title order={4}>Applications</Title>
      <Text fz="sm" color="gray.6">
        Manage applications
      </Text>
      <Paper shadow="xs" mt="2%" withBorder>
        <Flex p="md">
          <Group w="85%" style={{ gap: '0.3rem' }}>
            <FiGrid size="1rem" />
            <Text>Your applications</Text>
            {applicationsNR && applicationsNR > 0 ? <Badge>{applicationsNR}</Badge> : 0}
          </Group>

          <Group position="right">
            <CreateApplication />
          </Group>
        </Flex>
        <ApplicationsList onChange={handleApplicationsNR} />
      </Paper>
    </>
  )
}

export default Applications
