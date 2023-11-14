import { useState } from 'react'
import { Group, createStyles, Button, TextInput, Textarea, Checkbox, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import type { AxiosError } from 'axios'

import type { ApplicationValues } from '~/pages/UserProfile/contexts/application-context'
import {
  ApplicationFormProvider,
  useApplication
} from '~/pages/UserProfile/contexts/application-context'

import { useCreateApplication } from '~/api/user/applications'

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
  const [copyResourceScopes, setCopyResourceScopes] = useState(true)
  const setCreateApplicationMutation = useCreateApplication()

  const form = useApplication({
    initialValues: {
      name: '',
      description: '',
      copyPublicKey: false,
      copyResourceScopes: true
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
      copyPublicKey: copyPublicKey,
      copyResourceScopes: copyResourceScopes
    }

    setCreateApplicationMutation.mutate(newValues, {
      onSuccess: () => {
        notifications.show({
          message: `Application Created Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.show({
          title: 'Create Application Failed!',
          message: error?.response?.data?.msg,
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
            <Text color="gray.6">Scopes & Public key</Text>
            <Checkbox
              label="Copy Public Key"
              checked={copyPublicKey}
              onChange={() => setCopyPublicKey(o => !o)}
            />
            <Checkbox
              label="Copy Resource Scopes"
              checked={copyResourceScopes}
              onChange={() => setCopyResourceScopes(o => !o)}
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
