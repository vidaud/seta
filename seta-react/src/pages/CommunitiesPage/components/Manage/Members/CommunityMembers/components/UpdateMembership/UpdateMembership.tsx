import { useEffect, useState } from 'react'
import {
  Popover,
  Button,
  Group,
  createStyles,
  Tooltip,
  Select,
  ActionIcon,
  TextInput
} from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'

import { updateCommunityMembership } from '../../../../../../../../api/communities/membership'
import type { MembershipValues } from '../../../../../../pages/contexts/membership-context'
import {
  MembershipFormProvider,
  useMembership
} from '../../../../../../pages/contexts/membership-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})
const statusOptions = [
  { label: 'active', value: 'active' },
  { label: 'blocked', value: 'blocked' }
]

const UpdateMembership = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useMembership({
    initialValues: {
      status: '',
      role: ''
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: MembershipValues) => {
    updateCommunityMembership(props.community_id, values, props.user_id)
    setOpened(o => !o)
  }

  return (
    <Popover
      width={300}
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
          <Tooltip label="Update Membership">
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
        <MembershipFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="role" {...form.getInputProps('role')} withAsterisk />
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
        </MembershipFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateMembership
