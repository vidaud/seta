import { useEffect, useState } from 'react'
import { Box, Button, Group, Paper, Textarea } from '@mantine/core'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { useStyles } from '~/pages/ContactPage/style'
import type { AuthKeyValues } from '~/pages/UserProfile/common/contexts/auth-key-context'
import {
  AuthKeyFormProvider,
  useAuthKeys
} from '~/pages/UserProfile/common/contexts/auth-key-context'

import {
  useApplicationAuthKey,
  useDeleteAuthApplicationKey,
  useStoreApplicationAuthKey
} from '~/api/user/applications-auth-keys'
import { defaultNoPublicKeyMessage } from '~/common/constants'
import { notifications } from '~/utils/notifications'

const ApplicationAuthKey = ({ appName }) => {
  const { data } = useApplicationAuthKey(appName)
  const [publicKey, setpublicKey] = useState<string | undefined>(data?.publicKey)
  const setDeleteAuthKeyMutation = useDeleteAuthApplicationKey(appName)
  const { classes, cx } = useStyles()
  const setCreateApplicationMutation = useStoreApplicationAuthKey(appName)

  const form = useAuthKeys({
    initialValues: {
      publicKey: publicKey ? publicKey : defaultNoPublicKeyMessage
    },
    validate: values => ({
      publicKey: values.publicKey.length < 2 ? 'Too short key' : null
    })
  })

  useEffect(() => {
    if (data) {
      setpublicKey(data?.publicKey ? data?.publicKey : defaultNoPublicKeyMessage)
      form.setValues({
        publicKey: data?.publicKey ? data?.publicKey : defaultNoPublicKeyMessage
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, publicKey])

  const handleSubmit = (values: AuthKeyValues) => {
    setpublicKey(values.publicKey)
    setCreateApplicationMutation.mutate(values, {
      onSuccess: () => {
        notifications.showSuccess(`Key Saved Successfully!`, { autoClose: true })
      },
      onError: () => {
        notifications.showError('Key saving failed!', {
          autoClose: true
        })
      }
    })
  }

  const deletePublicKey = () => {
    setDeleteAuthKeyMutation.mutate(undefined, {
      onSuccess: () => {
        notifications.showSuccess(`Public Key deleted successfully!`, { autoClose: true })
        form.setValues({
          publicKey: defaultNoPublicKeyMessage
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        notifications.showError('Delete public Key failed!', {
          description: error?.response?.data?.msg
            ? error?.response?.data?.msg
            : error?.response?.data?.message,
          autoClose: true
        })
      }
    })
  }

  return (
    <Paper shadow="xs" p="md">
      <AuthKeyFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <Box className="public_key">
            <Textarea
              id="publicKey"
              {...form.getInputProps('publicKey')}
              maxRows={15}
              rows={12}
              cols={5}
              autosize
            />
          </Box>

          <Group position="right" mt="md">
            <Button disabled={form.values.publicKey === publicKey ? true : false} type="submit">
              Save Public Key
            </Button>
            <Button
              disabled={publicKey !== defaultNoPublicKeyMessage ? false : true}
              color="red"
              leftIcon={<RiDeleteBin5Line size="1rem" />}
              onClick={deletePublicKey}
            >
              Delete
            </Button>
          </Group>
        </form>
      </AuthKeyFormProvider>
    </Paper>
  )
}

export default ApplicationAuthKey
