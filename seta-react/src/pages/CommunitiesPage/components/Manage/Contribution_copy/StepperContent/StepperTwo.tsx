import React, { useContext, useEffect, useState } from 'react'
import { Group, Paper, Select, TextInput, createStyles, Textarea, ActionIcon } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar, IconTrash } from '@tabler/icons-react'

import AddMetadataFields from './AddMetadataField'

import {
  eu_languages,
  metadata_fields,
  mime_type_field
} from '../../Contribution/MetadataStep/constants'
import { Context } from '../context/Context'

const useStyles = createStyles(theme => ({
  field: {
    paddingBottom: theme.spacing.md
  },
  label: {
    textAlign: 'left'
  },
  group: {
    width: '90.5%'
  }
}))

export const StepperTwo = () => {
  const { classes } = useStyles()
  const [addField, setAddField] = useState<boolean>(false)
  const [fields, setFields] = useState<string | null>(null)
  const {
    formData,
    date,
    language,
    mimType,
    handleFormDataChange,
    handleDateChange,
    handleLanguageChange,
    handleMimeTypeChange
  } = useContext(Context)

  useEffect(() => {
    if (fields === 'other') {
      setAddField(true)
    } else {
      setAddField(false)
    }
  }, [fields])

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto">
        <Group className={classes.field}>
          <Select
            className={classes.label}
            label="Language"
            name="language"
            value={language}
            data={eu_languages}
            onChange={handleLanguageChange}
            withAsterisk
          />
          <DatePickerInput
            className={classes.label}
            icon={<IconCalendar size="1.1rem" stroke={1.5} />}
            label="Pick date"
            name="date"
            placeholder="Pick date"
            value={date}
            onChange={handleDateChange}
            mx="auto"
            maw={400}
            withAsterisk
          />
        </Group>
        <TextInput
          className={classes.label}
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleFormDataChange}
          withAsterisk
        />
        <TextInput
          className={classes.label}
          label="Link Origin"
          name="link_origin"
          value={formData.link_origin}
          onChange={handleFormDataChange}
          withAsterisk
        />
        <Group>
          <TextInput
            className={(classes.label, classes.group)}
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleFormDataChange}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group>
          <Textarea
            className={(classes.label, classes.group)}
            label="Abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleFormDataChange}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group className={classes.field}>
          <TextInput
            className={classes.label}
            label="Collection"
            name="collection"
            value={formData.collection}
            onChange={handleFormDataChange}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
          <TextInput
            className={classes.label}
            label="Reference"
            name="reference"
            value={formData.reference}
            onChange={handleFormDataChange}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group>
          <Textarea
            className={(classes.label, classes.group)}
            label="Text"
            name="text"
            value={formData.text}
            onChange={handleFormDataChange}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group className={classes.field}>
          <Select
            className={classes.label}
            label="Mime Type"
            value={mimType}
            onChange={handleMimeTypeChange}
            data={mime_type_field}
          />
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group className={classes.field}>
          <Select
            className={classes.label}
            label="Add Metadata Fields"
            value={fields}
            onChange={setFields}
            data={metadata_fields}
          />
        </Group>
        {addField ? <AddMetadataFields /> : ''}
      </Paper>
    </>
  )
}
