import { useState } from 'react'
import { Group, Paper, Select, TextInput, createStyles } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

import { eu_languages, metadata_fields } from './constants'

const useStyles = createStyles(theme => ({
  field: {
    paddingBottom: theme.spacing.md
  },
  label: {
    textAlign: 'left'
  }
}))

const MetadataStep = () => {
  const [value, setValue] = useState<string | null>(null)
  const [fields, setFields] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const { classes } = useStyles()

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto">
      <Group className={classes.field}>
        <Select
          className={classes.label}
          label="Language"
          value={value}
          onChange={setValue}
          data={eu_languages}
          withAsterisk
        />
        <DatePickerInput
          className={classes.label}
          icon={<IconCalendar size="1.1rem" stroke={1.5} />}
          label="Pick date"
          placeholder="Pick date"
          value={date}
          onChange={setDate}
          mx="auto"
          maw={400}
          withAsterisk
        />
      </Group>
      <TextInput
        className={classes.label}
        label="Title"
        value={title}
        onChange={event => setTitle(event.currentTarget.value)}
        withAsterisk
      />
      <TextInput
        className={classes.label}
        label="Link Origin"
        value={link}
        onChange={event => setLink(event.currentTarget.value)}
        withAsterisk
      />
      <Group className={classes.field}>
        <Select
          className={classes.label}
          label="Add Metadata Fields"
          value={fields}
          onChange={setFields}
          data={metadata_fields}
        />
      </Group>
    </Paper>
  )
}

export default MetadataStep
