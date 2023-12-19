import { useEffect } from 'react'
import { Group, Button, TextInput, Radio } from '@mantine/core'
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

  const form = useDatasource({
    initialValues: {
      title: '',
      description: '',
      organisation: '',
      theme: '',
      contact: {
        email: '',
        person: '',
        website: ''
      },
      status: ''
    },
    validate: values => ({
      id:
        values.id !== undefined && values.id?.length < 3
          ? 'ID should have at least 3 characters'
          : null,
      title: values.title.length < 5 ? 'Title should have at least 3 characters' : null,
      description:
        values.description.length < 5 ? 'Description should have at least 5 characters' : null
    })
  })

  useEffect(() => {
    if (datasource) {
      form.setValues({
        title: datasource.title,
        description: datasource.description,
        organisation: datasource.organisation,
        theme: datasource.theme,
        contact: datasource.contact,
        status: datasource.status,
        index: datasource.index
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource])

  const handleSubmit = (values: DatasourceResponse) => {
    const updatedValues = {
      title: values.title,
      description: values.description,
      organisation: values.organisation,
      theme: values.theme,
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
            <TextInput
              w="49%"
              label="Theme"
              {...form.getInputProps('theme')}
              className={cx(classes.input)}
              placeholder="Enter theme ..."
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
            />
            <TextInput
              w="49%"
              label="Email"
              icon={<IconAt size="1rem" />}
              {...form.getInputProps('contact.email')}
              className={cx(classes.input)}
              placeholder="Enter email ..."
            />
          </Group>
          <TextInput
            label="website"
            icon={<IoMdLink size="1rem" />}
            {...form.getInputProps('contact.website')}
            className={cx(classes.input)}
            placeholder="Enter website ..."
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
