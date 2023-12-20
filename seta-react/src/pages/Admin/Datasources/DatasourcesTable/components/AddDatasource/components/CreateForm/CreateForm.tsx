import { useState } from 'react'
import { TextInput, Group, createStyles, Button, Autocomplete, MultiSelect } from '@mantine/core'
import { IconAt, IconUser } from '@tabler/icons-react'
import type { AxiosError } from 'axios'
import { IoMdLink } from 'react-icons/io'

import {
  DatasourceFormProvider,
  useDatasource
} from '~/pages/Admin/Datasources/contexts/datasource-context'

import { useCreateDatasource } from '~/api/admin/datasources'
import type { DatasourceResponse } from '~/api/types/datasource-types'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ close, categories }) => {
  const { classes, cx } = useStyles()
  const setCreateDatasourceMutation = useCreateDatasource()
  const [data, setData] = useState<string[]>([])

  const form = useDatasource({
    initialValues: {
      id: '',
      index: '',
      title: '',
      description: '',
      organisation: '',
      themes: [],
      contact: {
        email: '',
        person: '',
        website: ''
      }
    },
    validate: values => ({
      id:
        values.id !== undefined && values.id?.length < 3
          ? 'ID should have at least 3 characters'
          : null,
      index:
        values.index !== undefined && values.index?.length < 3
          ? 'Index should have at least 3 characters'
          : null,
      title: values.title.length < 5 ? 'Title should have at least 3 characters' : null,
      description:
        values.description.length < 5 ? 'Description should have at least 5 characters' : null,
      organisation: values.organisation.length < 1 ? 'Organisation name is too short' : null,
      themes: values.themes.length < 1 ? 'Themes field is empty' : null
    })
  })

  const handleSubmit = (values: DatasourceResponse) => {
    const updatedValues = {
      id: values.id,
      index: values.index,
      title: values.title,
      description: values.description,
      organisation: values.organisation,
      themes: values.themes,
      contact: {
        email: values.contact?.email,
        person: values.contact?.person,
        website: values.contact?.website
      }
    }

    setCreateDatasourceMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.showSuccess(`Datasource Added Successfully!`, { autoClose: true })
        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        if (error?.response?.data?.errors.contact) {
          notifications.showError(`${error?.response?.data?.errors.contact}`, {
            autoClose: true
          })
        } else {
          notifications.showError('Add Datasource Failed!', {
            description: error?.response?.data?.message,
            autoClose: true
          })
        }
      }
    })
  }

  return (
    <DatasourceFormProvider form={form}>
      <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="ID"
          description="Id should be unique."
          {...form.getInputProps('id')}
          className={cx(classes.input)}
          placeholder="Enter datasource id ..."
          withAsterisk
          data-autofocus
        />
        <Autocomplete
          data={categories}
          label="Index"
          {...form.getInputProps('index')}
          placeholder="Select existing index or enter new one ..."
          className={cx(classes.input)}
          withAsterisk
        />
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
        <Group>
          <TextInput
            w="48%"
            label="Organisation"
            {...form.getInputProps('organisation')}
            className={cx(classes.input)}
            placeholder="Enter organisation name ..."
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
            placeholder="Enter contact ..."
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
          label="Website"
          icon={<IoMdLink size="1rem" />}
          {...form.getInputProps('contact.website')}
          className={cx(classes.input)}
          placeholder="Enter website ..."
          withAsterisk
        />
        <Group position="right" pt="md">
          <Button
            variant="outline"
            size="xs"
            color="blue"
            onClick={() => {
              form.reset()
              close()
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="xs">
            Save
          </Button>
        </Group>
      </form>
    </DatasourceFormProvider>
  )
}

export default CreateForm
