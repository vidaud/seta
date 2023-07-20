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
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/query-core'

import type { InviteResponse } from '~/api/types/invite-types'

import { updateInviteRequest } from '../../../../../../../api/communities/invite'
import type { InviteRequestValues } from '../../../../../pages/contexts/invite-request-context'
import {
  InviteRequestFormProvider,
  useInviteRequest
} from '../../../../../pages/contexts/invite-request-context'

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

type Props = {
  props: InviteResponse
  parent: string
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<InviteResponse[], unknown>>
}

const UpdateInviteRequest = ({ props, parent, refetch }: Props) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useInviteRequest({
    initialValues: {
      status: props.status
    }
  })

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: InviteRequestValues) => {
    updateInviteRequest(props.invite_id, values).then(() => {
      refetch()
    })
    // : updateInviteRequest(props.pending_invite.invite_id, values).then(() => {
    //     refetch()
    //   })

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
          <Tooltip label="Update Invitation Status" color="gray">
            {parent === 'InvitesList' ? (
              <ActionIcon>
                <IconPencil
                  size="1rem"
                  stroke={1.5}
                  onClick={e => {
                    e.stopPropagation()
                    setOpened(o => !o)
                  }}
                />
              </ActionIcon>
            ) : (
              <Button
                variant="outline"
                size="xs"
                color="gray"
                onClick={e => {
                  e.stopPropagation()
                  setOpened(o => !o)
                }}
              >
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
              onClick={e => e.stopPropagation()}
              onSelect={e => e.stopPropagation()}
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
        </InviteRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateInviteRequest
