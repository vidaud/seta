import { useState } from 'react'
import { Popover, Button, Group, Textarea, createStyles, Tooltip } from '@mantine/core'

import { createMembershipRequest } from '../../../../../../api/communities/membership'
import type { MembershipValues } from '../../membership-context'
import { MembershipFormProvider, useMembership } from '../../membership-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const MembershipRequest = ({ community_id, onReload }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembership({
    initialValues: {
      community_id: community_id,
      message: ''
    },
    validate: values => ({
      message: values?.message && values?.message.length < 2 ? 'Too short message' : null
    })
  })

  const handleSubmit = (values: MembershipValues) => {
    createMembershipRequest(community_id, values).then(() =>
      setTimeout(() => {
        onReload()
        setOpened(o => !o)
      }, 100)
    )
  }

  return (
    <Popover
      width={300}
      trapFocus
      position="top"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Join Community">
            <Button variant="filled" color="green" size="xs" onClick={() => setOpened(o => !o)}>
              + JOIN
            </Button>
          </Tooltip>
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
