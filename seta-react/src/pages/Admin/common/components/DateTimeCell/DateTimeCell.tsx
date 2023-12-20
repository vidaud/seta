import { Box, Group, Text } from '@mantine/core'
import { IconCalendarTime } from '@tabler/icons-react'
import moment from 'moment'

type Props = {
  dateTime: Date
}

const DateTimeCell = ({ dateTime }: Props) => {
  const date = moment.utc(dateTime).local().format('YYYY-MM-DD')
  const time = moment.utc(dateTime).local().format('HH:mm')

  return (
    <Group align="flex-start" spacing="xs">
      <Box pt={4}>
        <IconCalendarTime size="1.2rem" color="gray" />
      </Box>
      <Box m={0}>
        <Text fz="sm">{date}</Text>
        <Text fz="sm" c="dimmed">
          {time}
        </Text>
      </Box>
    </Group>
  )
}

export default DateTimeCell
