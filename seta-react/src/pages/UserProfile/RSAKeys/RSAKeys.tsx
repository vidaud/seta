import { useEffect, useState } from 'react'
import { Paper, Textarea, Box, Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { useDeleteRSAKey, useGeneratePublicKey, useRSAKey } from '~/api/user/rsa-keys'
import { defaultNoPublicKeyMessage } from '~/common/constants'

import { downLoadFile } from '../common/utils/utils'

const RSAKeys = () => {
  const { data } = useRSAKey()
  const [publicKey, setpublicKey] = useState<string>()
  const setDeleteRSAKeyMutation = useDeleteRSAKey()
  const setGeneratePublicKey = useGeneratePublicKey()

  useEffect(() => {
    if (data) {
      setpublicKey(data.value)
    }
  }, [data, publicKey])

  const deletePublicKey = () => {
    setDeleteRSAKeyMutation.mutate(undefined, {
      onSuccess: () => {
        notifications.show({
          message: `Public Key deleted successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        setpublicKey(defaultNoPublicKeyMessage)
      },
      onError: () => {
        notifications.show({
          message: 'Delete public Key failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  const generatePublicKey = () => {
    setGeneratePublicKey.mutate(undefined, {
      onSuccess: () => {
        notifications.show({
          message: `Public Key Generated Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        if (data) {
          downLoadFile(data['privateKey'], 'text/plain', `id_rsa`)
          setpublicKey(data?.value)
        }
      },
      onError: () => {
        notifications.show({
          message: 'Public Key generation failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Paper shadow="xs" p="md">
      <Box className="public_key">
        <Textarea
          label="Public Key"
          id="publicKey"
          value={publicKey ? publicKey : defaultNoPublicKeyMessage}
          maxRows={15}
          rows={12}
          cols={5}
          autosize
          readOnly
        />
      </Box>
      <Group position="right" mt="md">
        <Button onClick={generatePublicKey}>Generate Public Key</Button>
        <Button color="red" leftIcon={<RiDeleteBin5Line size="1rem" />} onClick={deletePublicKey}>
          Delete
        </Button>
      </Group>
    </Paper>
  )
}

export default RSAKeys
