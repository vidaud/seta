import { Box, Group, Text, Badge } from '@mantine/core'

type Props = {
  fieldName?: string
  newValue?: string
  currentValue?: string
}

const ChangedPropertyCell = ({ fieldName, newValue, currentValue }: Props) => {
  return (
    <Group align="flex-start">
      <Badge color="dark.3" radius="sm" size="lg">
        {fieldName}
      </Badge>
      <Box>
        <Text ta="center" fz="sm" c="dimmed">
          Current value:
        </Text>
        <Text ta="center" fz="md" fw={500}>
          {currentValue}
        </Text>
      </Box>
      <Box>
        <Text ta="center" fz="sm" c="dimmed">
          New value:
        </Text>
        <Text ta="center" fz="md" fw={600}>
          {newValue}
        </Text>
      </Box>
    </Group>
  )
}

export default ChangedPropertyCell
