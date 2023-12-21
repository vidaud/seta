import { useState } from 'react'
import { Anchor, Flex, Group, Paper, Text, Title } from '@mantine/core'
import { VscKey } from 'react-icons/vsc'

import StoreKey from './components/StoreKey/StoreKey'

const AuthKey = () => {
  const [key, setKey] = useState()

  const handleKey = value => {
    setKey(value)
  }

  return (
    <>
      <Title order={4}>Authentication Key</Title>
      <Text fz="sm" color="gray.6">
        {key ? (
          'This is the key associated with your account. Remove the key if you do not recognize.'
        ) : (
          <>
            There is no key associated with your account.
            <br /> Learn how to generate a key and add it to your account.
          </>
        )}
      </Text>
      <Text fz="sm" color="gray.6">
        Check out our guide to{' '}
        <Anchor href="/profile/key-generation-instructions" target="_blank">
          generating authentications keys
        </Anchor>
      </Text>
      <Paper shadow="xs" mt="2%" withBorder>
        <Flex p="md">
          <Group w="85%" style={{ gap: '0.3rem' }}>
            <VscKey size="1rem" />
            <Text>Public Key</Text>
          </Group>
        </Flex>
        <StoreKey onChange={handleKey} />
      </Paper>
    </>
  )
}

export default AuthKey
