import React from 'react'
import { Box, Group, Stack, Text, Title, createStyles } from '@mantine/core'

const useStyles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  }
})

export const StepperThree = () => {
  const { classes } = useStyles()

  return (
    <>
      <Group className={classes.container}>
        {/** form header */}
        <Box>
          <Title order={2} color="hsl(213, 96%, 18%)">
            Taxonomy
          </Title>
          <Text mt={7} fz={{ base: 17, md: 15 }} w="100%" color="hsl(231, 11%, 63%)" fw={400}>
            Select taxonomy from the select options or create a custom one
          </Text>
        </Box>
        {/** content body */}
        <Group w="100%">
          <Stack w="100%" spacing={10} />
        </Group>
      </Group>
    </>
  )
}
