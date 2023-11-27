import { useEffect, useState } from 'react'
import { Paper, Textarea, Box, Button, Group } from '@mantine/core'
import type { AxiosResponse } from 'axios'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { downLoadFile } from '~/pages/UserProfile/common/utils/utils'

import {
  useApplicationRSAKey,
  useDeleteRSAApplicationKey,
  useGenerateApplicationPublicKey
} from '~/api/user/applications-rsa-keys'
import { defaultNoPublicKeyMessage } from '~/common/constants'
import { useCurrentUser } from '~/contexts/user-context'
import { notifications } from '~/utils/notifications'

const ApplicationRSAKeys = ({ appName }) => {
  const { data } = useApplicationRSAKey(appName)
  const [publicKey, setpublicKey] = useState<string>()
  const un = useCurrentUser().user?.username
  const setDeleteRSAKeyMutation = useDeleteRSAApplicationKey(appName)
  const setGeneratePublicKey = useGenerateApplicationPublicKey(appName, un)
  const [disabledView, setDisabledView] = useState(false)

  useEffect(() => {
    if (data) {
      setpublicKey(data.publicKey)
    }
  }, [data, publicKey, disabledView])

  const deletePublicKey = () => {
    setDeleteRSAKeyMutation.mutate(appName, {
      onSuccess: () => {
        notifications.showSuccess(`Public Key deleted successfully!`, { autoClose: true })

        setpublicKey(defaultNoPublicKeyMessage)
      },
      onError: () => {
        notifications.showError('Delete public Key failed!', { autoClose: true })
      }
    })
  }

  const generatePublicKey = () => {
    setDisabledView(true)
    setGeneratePublicKey.mutate(appName, {
      onSuccess: (response: AxiosResponse) => {
        notifications.showSuccess(`Public Key Generated Successfully!`, { autoClose: true })

        if (response) {
          setDisabledView(false)
          downLoadFile(response.data?.privateKey, 'text/plain', `${appName}_id_rsa`)
          setpublicKey(response.data?.publicKey)
        }
      },
      onError: () => {
        setDisabledView(false)
        notifications.showError('Public Key generation failed!', { autoClose: true })
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
        <Button disabled={disabledView} onClick={generatePublicKey}>
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

export default ApplicationRSAKeys
