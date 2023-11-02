import { useState } from 'react'
import { Group, createStyles, Button, TextInput, Textarea, Checkbox, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import type { AxiosError } from 'axios'

import type { ApplicationValues } from '~/pages/UserProfile/contexts/application-context'
import {
  ApplicationFormProvider,
  useApplication
} from '~/pages/UserProfile/contexts/application-context'

import { useUserPermissions } from '~/api/communities/user-scopes'
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
  const { refetch } = useUserPermissions()
  const [copyPublicKey, setCopyPublicKey] = useState(false)
  const [copyResourceScopes, setCopyResourceScopes] = useState(true)
  const setCreateApplicationMutation = useCreateApplication()

  const form = useApplication({
    initialValues: {
      name: '',
      description: '',
      copy_public_key: false,
      copy_resource_scopes: true
    }
  })

  const handleSubmit = (values: ApplicationValues) => {
    setCreateApplicationMutation.mutate(values, {
      onSuccess: () => {
        notifications.show({
          message: `Application Created Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        refetch()
        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.show({
          message: error?.response?.data?.message,
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
