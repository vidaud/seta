import { useState } from 'react'
import { Group, createStyles, Button, TextInput, Textarea, Checkbox, Text } from '@mantine/core'
import type { AxiosError } from 'axios'

import {
  ApplicationFormProvider,
  useApplication,
  type ApplicationValues
} from '~/pages/UserProfile/common/contexts/application-context'

import { useCreateApplication } from '~/api/user/applications'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ close }) => {
  const { classes, cx } = useStyles()
  const [copyPublicKey, setCopyPublicKey] = useState(false)
  // const [copyDatasourceScopes, setCopyDatasourceScopes] = useState(true)
  const setCreateApplicationMutation = useCreateApplication()

  const form = useApplication({
    initialValues: {
      name: '',
      description: '',
      copyPublicKey: false
    },
    validate: values => ({
      name: values.name.length < 2 ? 'Name must have at least 2 letters' : null,
      description: values.description.length < 2 ? 'Too short description' : null
    })
  })

  const handleSubmit = (values: ApplicationValues) => {
    const newValues = {
      name: values.name,
      description: values.description,
      copyPublicKey: copyPublicKey
    }

    setCreateApplicationMutation.mutate(newValues, {
      onSuccess: () => {
        notifications.showSuccess(`Application Created Successfully!`, { autoClose: true })

        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.showError('Create Application Failed!', {
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
            label="Name"
            {...form.getInputProps('name')}
            className={cx(classes.input)}
            placeholder="Enter application name ..."
            withAsterisk
            data-autofocus
          />
          <Textarea
            label="Description"
            {...form.getInputProps('description')}
            placeholder="Enter description ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Group style={{ display: 'grid' }}>
            <Text color="gray.6">Other</Text>
            <Checkbox
              label="Copy Public Key"
              checked={copyPublicKey}
              onChange={() => setCopyPublicKey(o => !o)}
            />
          </Group>
          <Group position="right">
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
              Save application
            </Button>
          </Group>
        </form>
      </ApplicationFormProvider>
    </>
  )
}

export default CreateForm
