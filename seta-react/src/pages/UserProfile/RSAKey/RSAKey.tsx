import { useState } from 'react'
import { Flex, Group, Paper, Text, Title } from '@mantine/core'
import { VscKey } from 'react-icons/vsc'

import CreateRSAKey from './components/CreateRSAKey'
import KeysList from './components/KeyList/KeyList'

const RSAKey = () => {
  const [keyNR, setKeyNR] = useState<number>(0)

  const handleKeyNR = value => {
    setKeyNR(value)
  }

  return (
    <>
      <Title order={4}>RSA Key</Title>
      <Text fz="sm" color="gray.6">
        {keyNR && keyNR > 0 ? (
          'This is a list of keys associated with your account. Remove any keys that you do not recognize.'
        ) : (
          <>
            There are no keys associated with your account.
            <br /> Learn how to generate a key and add it to your account.
          </>
        )}
      </Text>
      <Paper shadow="xs" mt="2%" withBorder>
        <Flex p="md">
          <Group w="85%" style={{ gap: '0.3rem' }}>
            <VscKey size="1rem" />
            <Text>Your Keys</Text>
          </Group>

          <Group position="right">
            <CreateRSAKey />
          </Group>
        </Flex>
        <KeysList onChange={handleKeyNR} />
      </Paper>
    </>
  )
}

export default RSAKey
