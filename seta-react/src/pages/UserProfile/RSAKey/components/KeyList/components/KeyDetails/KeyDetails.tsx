import { Button, Grid, Group, createStyles } from '@mantine/core'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { VscKey } from 'react-icons/vsc'

import { useDeleteRSAKey } from '~/api/user/rsa-keys'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles(() => ({
  td: {
    width: '10%',
    textAlign: 'center'
  }
}))

const KeyDetails = ({ props }) => {
  const { classes } = useStyles()
  const setDeleteRSAKeyMutation = useDeleteRSAKey()

  const deletePublicKey = () => {
    setDeleteRSAKeyMutation.mutate(undefined, {
      onSuccess: () => {
        notifications.showSuccess(`Public Key deleted successfully!`, { autoClose: true })
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
    <>
      <tr>
        <td className={classes.td}>
          <VscKey size="2rem" />
        </td>
        <td>
          <Grid pl={0.2} pr={0.2}>
            <Grid.Col>name</Grid.Col>
            <Grid.Col>value</Grid.Col>
            <Grid.Col>date</Grid.Col>
            <Grid.Col>permissions</Grid.Col>
          </Grid>
        </td>
        <td width="20%">
          <Group position="center">
            <Button
              color="red"
              variant="outline"
              leftIcon={<RiDeleteBin5Line size="1rem" />}
              onClick={deletePublicKey}
            >
              Delete
            </Button>
          </Group>
        </td>
      </tr>
    </>
  )
}

export default KeyDetails
