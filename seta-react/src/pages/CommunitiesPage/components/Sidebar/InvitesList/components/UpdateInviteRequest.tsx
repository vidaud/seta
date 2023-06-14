import { useEffect, useState } from 'react'
import {
  Popover,
  Button,
  Group,
  createStyles,
  Tooltip,
  Select,
  ActionIcon,
  Divider,
  Text
} from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'

import { updateInviteRequest } from '../../../../../../api/communities/invite'
import type { InviteRequestValues } from '../../../Manage/invite-request-context'
import { InviteRequestFormProvider, useInviteRequest } from '../../../Manage/invite-request-context'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  divider: {
    paddingBottom: theme.spacing.md
  },
  text: {
    textAlign: 'center'
  },
  dropdown: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  }
}))
const statusOptions = [
  { label: 'accepted', value: 'accepted' },
  { label: 'rejected', value: 'rejected' }
]

const UpdateInviteRequest = ({ props, parent }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useInviteRequest({
    initialValues: {
      invite_id: props.invite_id,
      status: props.status
    }
  })

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: InviteRequestValues) => {
    parent === 'InvitesList'
      ? updateInviteRequest(props.invite_id, values)
      : updateInviteRequest(props.pending_invite.invite_id, values)

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
            {parent === 'InvitesList' ? (
              <ActionIcon>
                <IconPencil size="1rem" stroke={1.5} onClick={() => setOpened(o => !o)} />
              </ActionIcon>
            ) : (
              <Button variant="outline" size="xs" color="orange" onClick={() => setOpened(o => !o)}>
                INVITED
              </Button>
            )}
          </Tooltip>
        </Group>
      </Popover.Target>
      <Popover.Dropdown className={cx(classes.dropdown)}>
        <Text size="md" className={cx(classes.text)}>
          Update Invite Status
        </Text>
        <Divider size="xs" className={cx(classes.divider)} />
        <InviteRequestFormProvider form={form}>
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
        </InviteRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateInviteRequest
