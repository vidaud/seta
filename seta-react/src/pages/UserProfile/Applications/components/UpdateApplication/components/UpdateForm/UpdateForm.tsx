import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea, Select } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import type { ApplicationValues } from '~/pages/UserProfile/contexts/application-context'
import {
  ApplicationFormProvider,
  useApplication
} from '~/pages/UserProfile/contexts/application-context'

import { useUpdateApplication } from '~/api/user/applications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  form: {
    textAlign: 'left'
  }
})

const applicationStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' }
]

const UpdateForm = ({ application, close }) => {
  const { classes, cx } = useStyles()
  const old_name = application.name
  const setUpdateApplicationMutation = useUpdateApplication()

  const form = useApplication({
    initialValues: {
      new_name: '',
      description: '',
      status: ''
    }
  })

  useEffect(() => {
    if (application) {
      form.setValues({
        new_name: application.name,
        description: application.description,
        status: application.status
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application])

  const handleSubmit = (values: ApplicationValues) => {
    const updatedValues = {
      new_name: values.name,
      description: values.description,
      status: values.status,
      name: old_name
    }

    setUpdateApplicationMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.show({
          message: `Application Updated Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        close()
      },
      onError: () => {
        notifications.show({
          message: 'Application update failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <>
      <ApplicationFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            {...form.getInputProps('new_name')}
            placeholder="Enter application name ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Textarea
            label="Description"
            {...form.getInputProps('description')}
            placeholder="Enter description ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Select
            label="Status"
            name="status"
            sx={{ width: 'fit-content' }}
            data={applicationStatus}
            {...form.getInputProps('status')}
            className={cx(classes.input)}
          />
          <Group position="right">
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
      </ApplicationFormProvider>
    </>
  )
}

export default UpdateForm
