import { useState } from 'react'
import { Popover, Button, Group, Textarea, createStyles, Tooltip } from '@mantine/core'

import type { MembershipValues } from '~/pages/CommunitiesPage/contexts/membership-context'
import {
  MembershipFormProvider,
  useMembership
} from '~/pages/CommunitiesPage/contexts/membership-context'

import { createMembershipRequest } from '~/api/communities/membership'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const MembershipRequest = ({ community_id, refetch }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembership({
    initialValues: {
      message: ''
    },
    validate: values => ({
      message: values?.message && values?.message.length < 2 ? 'Too short message' : null
    })
  })

  const handleSubmit = (values: MembershipValues) => {
    createMembershipRequest(community_id, values).then(() =>
      setTimeout(() => {
        refetch()
        setOpened(o => !o)
      }, 100)
    )
  }

  return (
    <Popover
      width={300}
      trapFocus
      position="top"
      withinPortal={true}
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Send Join Request" color="orange">
            <Button
              variant="filled"
              color="orange"
              size="xs"
              onClick={e => {
                e.stopPropagation()
                setOpened(o => !o)
              }}
            >
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
              placeholder={'Reason: \nProject: \nOther:'}
              size="xs"
              minRows={4}
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
                  e.stopPropagation()
                  setOpened(o => !o)
                }}
              >
                Cancel
              </Button>
              <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
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
