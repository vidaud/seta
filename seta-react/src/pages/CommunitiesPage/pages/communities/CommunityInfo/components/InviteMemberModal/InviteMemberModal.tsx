import { useState } from 'react'
import {
  Popover,
  Button,
  Group,
  Textarea,
  createStyles,
  Input,
  UnstyledButton
} from '@mantine/core'
import { IconMessages } from '@tabler/icons-react'

import { createCommunityInvite } from '../../../../../../../api/communities/invite'
import { InvitationFormProvider, useInvitation } from '../../../../contexts/invite-context'
import type { InvitationValues } from '../../../../contexts/invite-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
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
      // withinPortal={true}
      // trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group>
          <UnstyledButton
            className={classes.button}
            onClick={e => {
              e.stopPropagation()
              setOpened(o => !o)
            }}
          >
            <IconMessages size="1rem" stroke={1.5} />
            {'  '} Invite
          </UnstyledButton>
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
                onClick={e => e.stopPropagation()}
              />
            </Input.Wrapper>
            <Textarea
              label="Message"
              {...form.getInputProps('message')}
              placeholder="Message"
              size="xs"
              withAsterisk
              onClick={e => e.stopPropagation()}
            />

            <Group className={cx(classes.form)}>
              <Button
                variant="outline"
                size="xs"
                color="blue"
                onClick={e => {
                  form.reset()
                  setOpened(o => !o)
                  e.stopPropagation()
                }}
              >
                Cancel
              </Button>
              <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
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
