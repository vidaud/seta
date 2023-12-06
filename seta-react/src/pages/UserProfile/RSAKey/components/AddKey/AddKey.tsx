import { useEffect, useState } from 'react'
import { Box, Button, Group, Paper, Textarea } from '@mantine/core'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { useStyles } from '~/pages/ContactPage/style'
import type { RSAKeyValues } from '~/pages/UserProfile/common/contexts/rsa-key-context'
import { RSAKeyFormProvider, useRSAKeys } from '~/pages/UserProfile/common/contexts/rsa-key-context'

import { useCreateKey } from '~/api/user/rsa-key'
import { useDeleteRSAKey, useRSAKey } from '~/api/user/rsa-keys'
import { defaultNoPublicKeyMessage } from '~/common/constants'
import { notifications } from '~/utils/notifications'

const AddKey = ({ onChange }) => {
  const { data } = useRSAKey()
  const [publicKey, setpublicKey] = useState<string | undefined>(data?.publicKey)
  const setDeleteRSAKeyMutation = useDeleteRSAKey()
  const { classes, cx } = useStyles()
  const setCreateApplicationMutation = useCreateKey()

  useEffect(() => {
    if (data) {
      setpublicKey(data?.publicKey)
      onChange(data?.publicKey)
    }
  }, [data, publicKey, onChange])

  const form = useRSAKeys({
    initialValues: {
      key: publicKey ? publicKey : defaultNoPublicKeyMessage
    },
    validate: values => ({
      key: values.key.length < 2 ? 'Too short key' : null
    })
  })

  const handleSubmit = (values: RSAKeyValues) => {
    const newValues = {
      key: values.key
    }

    setpublicKey(values.key)
    setCreateApplicationMutation.mutate(newValues, {
      onSuccess: () => {
        notifications.showSuccess(`Key Saved Successfully!`, { autoClose: true })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: () => {
        notifications.showError('Key saving failed!', {
          autoClose: true
        })
      }
    })
  }

  const deletePublicKey = () => {
    setDeleteRSAKeyMutation.mutate(undefined, {
      onSuccess: () => {
        notifications.showSuccess(`Public Key deleted successfully!`, { autoClose: true })

        setpublicKey(defaultNoPublicKeyMessage)
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
      <RSAKeyFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <Box className="public_key">
            <Textarea
              // label="Public Key"
              id="publicKey"
              {...form.getInputProps('key')}
              maxRows={15}
              rows={12}
              cols={5}
              autosize
            />
          </Box>

          <Group position="right" mt="md">
            <Button disabled={form.values.key === publicKey ? true : false}>Save Public Key</Button>
            <Button
              disabled={publicKey ? false : true}
              color="red"
              leftIcon={<RiDeleteBin5Line size="1rem" />}
              onClick={deletePublicKey}
            >
              Delete
            </Button>
          </Group>
        </form>
      </RSAKeyFormProvider>
    </Paper>
  )
}

export default AddKey
