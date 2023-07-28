import React from 'react'
import { Paper, Text, Box, Group } from '@mantine/core'

type Props = {
  icon: React.ReactNode
  title: string
  label?: string
  count: number
}

const SimpleStat = ({ icon, title, label, count }: Props) => {
  const countColor = count === 0 ? 'gray' : 'orange'

  return (
    <Paper radius="md" shadow="md" p="xs">
      <Group align="flex-start">
        {icon}
        <Box>
          <Text color="dimmed" size={14} transform="capitalize" fw={700}>
            {title}
          </Text>
          <Box mt={10}>
            <Text size="xl" component="span" fw={600} mr={10} color={countColor}>
              {count}
            </Text>

            <Text size="md" component="span" c="dimmed">
              {label}
            </Text>
          </Box>
        </Box>
      </Group>
    </Paper>
  )
}

export default SimpleStat
