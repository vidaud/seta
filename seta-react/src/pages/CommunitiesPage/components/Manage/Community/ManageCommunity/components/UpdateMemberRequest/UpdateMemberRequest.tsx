import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Tooltip, Select, ActionIcon } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'

import { updateMembershipRequest } from '../../../../../../../../api/communities/membership-requests'
import type { MembershipRequestValues } from '../../../../membership-request-context'
import {
  MembershipRequestFormProvider,
  useMembershipRequest
} from '../../../../membership-request-context'

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

const UpdateInvite = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembershipRequest({
    initialValues: {
      community_id: props.community_id,
      user_id: props.requested_by,
      status: ''
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: MembershipRequestValues) => {
    updateMembershipRequest(props.community_id, values, props.requested_by)
    setOpened(o => !o)
  }

  return (
    <Popover
      width={200}
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

export default UpdateInvite
