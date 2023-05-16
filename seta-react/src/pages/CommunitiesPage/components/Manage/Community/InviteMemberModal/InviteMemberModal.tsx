import { useState } from 'react'
import { Popover, Button, Group, Textarea, createStyles, Input } from '@mantine/core'

import { createCommunityInvite } from '../../../../../../api/communities/community'
import { InvitationFormProvider, useInvitation } from '../../invite-context'
import type { InvitationValues } from '../../invite-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const InviteMember = communityId => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useInvitation({
    initialValues: {
      email: [],
      message: ''
    }
    // validate: {
    //   email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    // }
  })

  const handleSubmit = (values: InvitationValues) => {
    createCommunityInvite(communityId.id, values)
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
          <Button variant="outline" size="xs" color="orange" onClick={() => setOpened(o => !o)}>
            + Invite
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <InvitationFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Input.Wrapper
              label="Emails"
              withAsterisk
              description="Please enter emails of friends you want to be invited"
            >
              <Input
                {...form.getInputProps('email')}
                placeholder="john@doe.com"
                size="xs"
                mt="xs"
                multiple={true}
              />
            </Input.Wrapper>
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
        </InvitationFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default InviteMember
