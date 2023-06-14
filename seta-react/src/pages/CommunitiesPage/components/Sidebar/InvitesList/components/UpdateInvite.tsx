import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Tooltip, Select, ActionIcon } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'

import { updateInviteRequest } from '../../../../../../api/communities/invite'
import type { InviteRequestValues } from '../../../Manage/invite-request-context'
import { InviteRequestFormProvider, useInviteRequest } from '../../../Manage/invite-request-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})
const statusOptions = [
  { label: 'accepted', value: 'accepted' },
  { label: 'rejected', value: 'rejected' }
]

const UpdateInviteRequest = ({ props }) => {
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
    updateInviteRequest(props.invite_id, values)
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
