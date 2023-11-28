import { useEffect, useState } from 'react'
import { Paper, Textarea, Box, Button, Group } from '@mantine/core'
import type { AxiosResponse } from 'axios'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { useDeleteRSAKey, useGeneratePublicKey, useRSAKey } from '~/api/user/rsa-keys'
import { defaultNoPublicKeyMessage } from '~/common/constants'
import { useCurrentUser } from '~/contexts/user-context'
import { notifications } from '~/utils/notifications'

import { downLoadFile } from '../common/utils/utils'

const RSAKeys = () => {
  const { data } = useRSAKey()
  const [publicKey, setpublicKey] = useState<string>()
  const setDeleteRSAKeyMutation = useDeleteRSAKey()
  const un = useCurrentUser().user?.username
  const setGeneratePublicKey = useGeneratePublicKey(un)
  const [disabledView, setDisabledView] = useState(false)

  useEffect(() => {
    if (data) {
      setpublicKey(data.publicKey)
    }
  }, [data, publicKey, disabledView])

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

  const generatePublicKey = () => {
    setDisabledView(true)
    setGeneratePublicKey.mutate(undefined, {
      onSuccess: (response: AxiosResponse) => {
        notifications.showSuccess(`Public Key Generated Successfully!`, { autoClose: true })

        if (response) {
          setDisabledView(false)
          downLoadFile(response.data?.privateKey, 'text/plain', `seta_id_rsa`)
          setpublicKey(response.data?.publicKey)
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        setDisabledView(false)
        notifications.showError('Public Key generation failed!', {
          description: error?.response?.data?.msg,
          autoClose: true
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
        <Button
          disabled={disabledView}
          onClick={() => {
            generatePublicKey()
          }}
        >
          Generate Public Key
        </Button>
        <Button
          color="red"
          disabled={disabledView}
          leftIcon={<RiDeleteBin5Line size="1rem" />}
          onClick={deletePublicKey}
        >
          Delete
        </Button>
      </Group>
    </Paper>
  )
}

export default RSAKeys
