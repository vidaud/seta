import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea, Select } from '@mantine/core'

import type { ApplicationValues } from '~/pages/UserProfile/common/contexts/application-context'
import {
  ApplicationFormProvider,
  useApplication
} from '~/pages/UserProfile/common/contexts/application-context'

import { useUpdateApplication } from '~/api/user/applications'
import { notifications } from '~/utils/notifications'

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
  const setUpdateApplicationMutation = useUpdateApplication()

  const form = useApplication({
    initialValues: {
      name: '',
      new_name: '',
      description: '',
      status: ''
    },
    validate: values => ({
      new_name:
        values.new_name && values.new_name.length < 2 ? 'Name must have at least 2 letters' : null,
      description: values.description.length < 2 ? 'Too short description' : null
    })
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
      new_name: values.new_name,
      description: values.description,
      status: values.status,
      name: application.name
    }

    setUpdateApplicationMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.showSuccess(`Application Updated Successfully!`, { autoClose: true })

        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        notifications.showError('Application update failed!', {
          description: error?.response?.data?.msg
            ? error?.response?.data?.msg
            : error?.response?.data?.message,

          autoClose: true
        })
      }
    })
  }

  return (
    <>
      <ApplicationFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
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
