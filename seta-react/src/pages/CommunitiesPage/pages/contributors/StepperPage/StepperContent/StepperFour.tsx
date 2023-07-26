import React from 'react'
import { Box, Group, Stack, Text, Title } from '@mantine/core'

export const StepperFour = () => {
  return (
    <>
      <Group>
        <Box>
          <Title order={2} color="hsl(213, 96%, 18%)">
            Finishing up
          </Title>
          <Text mt={7} fz={{ base: 17, md: 15 }} w="100%" color="hsl(231, 11%, 63%)" fw={400}>
            Review the information before submitting
          </Text>
        </Box>
        <Group w="100%">
          <Stack w="100%" />
        </Group>
      </Group>
    </>
  )
}
