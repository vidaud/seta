import React from 'react'
import { Flex, Image, Stack, Text, Title } from '@mantine/core'

export const StepperFive = () => {
  return (
    <>
      <Flex align="center" justify="center" h="100%">
        <Stack align="center">
          <Image width={70} src="/icon-thank-you.svg" />
          <Title order={2} color="hsl(213, 96%, 18%)">
            Contribution Created
          </Title>
          <Text align="center" color="hsl(231, 11%, 63%)" fz={{ base: 16, md: 13.5 }}>
            Go back to the list of resources in your community to see the new contribution listed
          </Text>
        </Stack>
      </Flex>
    </>
  )
}
