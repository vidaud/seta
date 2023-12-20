import { useEffect, useState } from 'react'
import { Group, Button, TextInput, Radio, MultiSelect } from '@mantine/core'
import { IconAt, IconUser } from '@tabler/icons-react'
import type { AxiosError } from 'axios'
import { IoMdLink } from 'react-icons/io'

import {
  DatasourceFormProvider,
  useDatasource
} from '~/pages/Admin/Datasources/contexts/datasource-context'

import { useUpdateDatasource } from '~/api/admin/datasources'
import type { DatasourceResponse } from '~/api/types/datasource-types'
import { notifications } from '~/utils/notifications'

import { useStyles } from '../style'

const UpdateForm = ({ datasource, close }) => {
  const { classes, cx } = useStyles()
  const setUpdateDatasourceMutation = useUpdateDatasource(datasource.id)
  const [data, setData] = useState<string[]>(datasource.themes)

  const form = useDatasource({
    initialValues: {
      title: '',
      description: '',
      organisation: '',
      themes: [],
      contact: {
        email: '',
        person: '',
        website: ''
      },
      status: ''
    },
    validate: {
      title: (value, values) =>
        values && values.title.length < 3
          ? 'Title should have at least 3 characters and should be unique'
          : null,
      description: (value, values) =>
        values && values.description.length < 5
          ? 'Description should have at least 5 characters'
          : null,
      organisation: (value, values) =>
        values && values.organisation.length < 3
          ? 'Organisation should have at least 3 characters'
          : null,
      themes: value => (value && value.length < 1 ? 'Themes field should not be empty' : null),
      contact: {
        email: value =>
          value.length < 2
            ? 'The email address is not valid. It must have exactly one @-sign'
            : null,
        website: value =>
          value.length < 2 ? 'Input should be a valid URL, relative URL without a base' : null,
        person: value => (value.length < 2 ? 'Contact person name is too short' : null)
      }
    }
  })

  useEffect(() => {
    if (datasource) {
      form.setValues(datasource)
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource])

  const handleSubmit = (values: DatasourceResponse) => {
    const updatedValues = {
      title: values.title,
      description: values.description,
      organisation: values.organisation,
      themes: values.themes,
      contact: {
        email: values.contact?.email ? values.contact.email : '-',
        person: values.contact?.person ? values.contact.person : '-',
        website: values.contact?.website ? values.contact?.website : '-'
      },
      status: values.status,
      index: datasource.index
    }

    setUpdateDatasourceMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.showSuccess(`Datasource Updated Successfully!`, { autoClose: true })

        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        if (error?.response?.data?.errors.contact) {
          notifications.showError(`${error?.response?.data?.errors.contact}`, {
            autoClose: true
          })
        } else {
          notifications.showError('Datasource update failed!', {
            description: error?.response?.data?.message,
            autoClose: true
          })
        }
      }
    })
  }

  return (
    <>
      <DatasourceFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Title"
            {...form.getInputProps('title')}
            className={cx(classes.input)}
            placeholder="Enter title ..."
            withAsterisk
          />
          <TextInput
            label="Description"
            {...form.getInputProps('description')}
            className={cx(classes.input)}
            placeholder="Enter description ..."
            withAsterisk
          />
          <Group sx={{ gap: '0.9rem' }}>
            <TextInput
              w="48%"
              label="Organisation"
              {...form.getInputProps('organisation')}
              className={cx(classes.input)}
              placeholder="Enter organisation ..."
              withAsterisk
            />
            <MultiSelect
              w="49%"
              mb="20px"
              label="Themes"
              data={data}
              placeholder="Add new theme"
              {...form.getInputProps('themes')}
              searchable
              creatable
              rightSection={<></>}
              getCreateLabel={query => `+ Add theme "${query}"`}
              onCreate={query => {
                const item = query

                setData(current => [...current, item])

                return item
              }}
              withAsterisk
            />
          </Group>
          <Group>
            <TextInput
              w="48%"
              label="Contact Person"
              icon={<IconUser size="1rem" />}
              {...form.getInputProps('contact.person')}
              className={cx(classes.input)}
              placeholder="Enter person ..."
              withAsterisk
            />
            <TextInput
              w="49%"
              label="Email"
              icon={<IconAt size="1rem" />}
              {...form.getInputProps('contact.email')}
              className={cx(classes.input)}
              placeholder="Enter email ..."
              withAsterisk
            />
          </Group>
          <TextInput
            label="website"
            icon={<IoMdLink size="1rem" />}
            {...form.getInputProps('contact.website')}
            className={cx(classes.input)}
            placeholder="Enter website ..."
            withAsterisk
          />
          <Radio.Group label="Status" {...form.getInputProps('status')}>
            <Radio value="active" label="Active" />
            <Radio value="archived" label="Archived" mt="xs" />
          </Radio.Group>
          <Group position="right" pt="md">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                close()
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>

            <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
              Update
            </Button>
          </Group>
        </form>
      </DatasourceFormProvider>
    </>
  )
}

export default UpdateForm
