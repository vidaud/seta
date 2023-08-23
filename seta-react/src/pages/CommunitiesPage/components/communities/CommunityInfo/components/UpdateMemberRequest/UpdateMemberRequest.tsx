import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Tooltip, Select, ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPencil } from '@tabler/icons-react'

import type { MembershipRequestValues } from '~/pages/CommunitiesPage/contexts/membership-request-context'
import {
  MembershipRequestFormProvider,
  useMembershipRequest
} from '~/pages/CommunitiesPage/contexts/membership-request-context'

import { updateMembershipRequest } from '~/api/communities/membership-requests'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})
const statusOptions = [
  { label: 'pending', value: 'pending' },
  { label: 'approved', value: 'approved' },
  { label: 'rejected', value: 'rejected' }
]

const UpdateMemberRequest = ({ props, refetch }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembershipRequest({
    initialValues: {
      status: ''
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues(props)
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const handleSubmit = (values: MembershipRequestValues) => {
    updateMembershipRequest(props.community_id, values, props.requested_by)
      .then(() => {
        refetch()
        notifications.show({
          title: 'Membership Request Updated',
          message: 'Membership request has been updated by the owner/manager',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.teal[6],
              borderColor: theme.colors.teal[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.teal[7] }
            }
          })
        })
      })
      .catch(error => {
        notifications.show({
          title: error.response.statusText,
          message: error.response.data.message,
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] }
            }
          })
        })
      })

    setOpened(o => !o)
  }

  return (
    <Popover
      width={200}
      withinPortal={true}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Update Status">
            <ActionIcon>
              <IconPencil size="1rem" stroke={1.5} onClick={() => setOpened(o => !o)} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <MembershipRequestFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Select
              {...form.getInputProps('status')}
              label="Status"
              name="status"
              data={statusOptions}
              withAsterisk
            />

            <Group className={cx(classes.form)}>
              <Button
                variant="outline"
                size="xs"
                color="blue"
                onClick={() => {
                  form.reset()
                  setOpened(o => !o)
                }}
              >
                Cancel
              </Button>
              <Button size="xs" type="submit">
                Send
              </Button>
            </Group>
          </form>
        </MembershipRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateMemberRequest
