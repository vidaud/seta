import { useState } from 'react'
import { Popover, Button, Group, Textarea, createStyles } from '@mantine/core'

import { createMembershipRequest } from '../../../../../../api/communities/membership'
import type { MembershipValues } from '../../imembership-context'
import { MembershipFormProvider, useMembership } from '../../imembership-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const MembershipRequest = ({ community_id }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembership({
    initialValues: {
      community_id: community_id,
      message: ''
    }
  })

  const handleSubmit = (values: MembershipValues) => {
    createMembershipRequest(community_id, values)
    setOpened(o => !o)
  }

  return (
    <Popover
      width={300}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Button variant="outline" size="xs" onClick={() => setOpened(o => !o)}>
            + Join
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <MembershipFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Textarea
              label="Message"
              {...form.getInputProps('message')}
              placeholder="Message"
              size="xs"
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
        </MembershipFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default MembershipRequest
