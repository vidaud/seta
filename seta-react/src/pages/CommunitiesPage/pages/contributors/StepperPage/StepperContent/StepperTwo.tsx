import React, { useContext, useEffect, useState } from 'react'
import type { SelectItem } from '@mantine/core'
import { Group, Paper, Select, TextInput, createStyles, Textarea, ActionIcon } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar, IconTrash } from '@tabler/icons-react'

import AddMetadataFields from './AddMetadataField'

import { eu_languages, metadata_fields, mime_type_field } from '../constants'
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
  const [fieldToShow, setFieldToShow] = useState<string[] | null>([])
  const [allFields, setAllFields] = useState<readonly (string | SelectItem)[]>(metadata_fields)

  // const [selectedField, setSelectedField] = useState<string | null>(null)
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

  const showFields = (e: string) => {
    setFields(e)
    setFieldToShow(ing => [...(ing as []), e])
  }

  const deleteField = i => {
    const newFormValues = [...(fieldToShow as [])]

    newFormValues.splice(i, 1)
    setFieldToShow(newFormValues)
  }

  useEffect(() => {
    if (fields === 'other') {
      setAddField(true)
    } else {
      setAddField(false)
    }

    setAllFields(metadata_fields.filter(ar => !fieldToShow?.find(rm => rm === ar.value)))
  }, [fields, fieldToShow, metadata_fields])

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
        {fieldToShow?.includes('author') ? (
          <Group>
            <TextInput
              className={(classes.label, classes.group)}
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleFormDataChange}
            />
            <ActionIcon color="red">
              <IconTrash name="author" size="1.5rem" stroke={1.5} onClick={deleteField} />
            </ActionIcon>
          </Group>
        ) : null}
        {fieldToShow?.includes('abstract') ? (
          <Group>
            <Textarea
              className={(classes.label, classes.group)}
              label="Abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleFormDataChange}
            />
            <ActionIcon color="red">
              <IconTrash name="abstract" size="1.5rem" stroke={1.5} onClick={deleteField} />
            </ActionIcon>
          </Group>
        ) : null}
        <Group className={classes.field}>
          {fieldToShow?.includes('collection') ? (
            <Group>
              <TextInput
                className={classes.label}
                label="Collection"
                name="collection"
                value={formData.collection}
                onChange={handleFormDataChange}
              />
              <ActionIcon color="red">
                <IconTrash name="collection" size="1.5rem" stroke={1.5} onClick={deleteField} />
              </ActionIcon>
            </Group>
          ) : null}
          {fieldToShow?.includes('reference') ? (
            <Group>
              <TextInput
                className={classes.label}
                label="Reference"
                name="reference"
                value={formData.reference}
                onChange={handleFormDataChange}
              />
              <ActionIcon color="red">
                <IconTrash name="reference" size="1.5rem" stroke={1.5} onClick={deleteField} />
              </ActionIcon>
            </Group>
          ) : null}
        </Group>
        {fieldToShow?.includes('text') ? (
          <Group>
            <Textarea
              className={(classes.label, classes.group)}
              label="Text"
              name="text"
              value={formData.text}
              onChange={handleFormDataChange}
            />
            <ActionIcon color="red">
              <IconTrash name="text" size="1.5rem" stroke={1.5} onClick={deleteField} />
            </ActionIcon>
          </Group>
        ) : null}
        {fieldToShow?.includes('mimType') ? (
          <Group className={classes.field}>
            <Select
              className={classes.label}
              name="mimType"
              label="Mime Type"
              value={mimType}
              onChange={handleMimeTypeChange}
              data={mime_type_field}
            />
            <ActionIcon color="red">
              <IconTrash name="mimType" size="1.5rem" stroke={1.5} onClick={deleteField} />
            </ActionIcon>
          </Group>
        ) : null}
        <Group className={classes.field}>
          <Select
            className={classes.label}
            label="Add Metadata Fields"
            value={fields}
            onChange={showFields}
            data={allFields}
          />
        </Group>
        {addField ? <AddMetadataFields /> : ''}
      </Paper>
    </>
  )
}
