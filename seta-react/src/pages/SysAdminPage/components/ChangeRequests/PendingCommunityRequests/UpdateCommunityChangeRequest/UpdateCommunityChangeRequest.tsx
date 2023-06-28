import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Select, ActionIcon } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

import { updateCommunityChangeRequest } from '../../../../../../api/communities/community-change-requests'
import type { CommunityChangeRequestValues } from '../../../../../CommunitiesPage/pages/contexts/community-change-request-context'
import {
  CommunityChangeRequestFormProvider,
  useCommunityChangeRequest
} from '../../../../../CommunitiesPage/pages/contexts/community-change-request-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})
const statusOptions = [
  { label: 'approved', value: 'approved' },
  { label: 'rejected', value: 'rejected' }
]

const UpdateCommunityChangeRequest = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useCommunityChangeRequest({
    initialValues: {
      status: ''
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues({
        status: props.status
      })
    }
  }, [props])

  const handleSubmit = (values: CommunityChangeRequestValues) => {
    updateCommunityChangeRequest(props.community_id, props.request_id, values)
    setOpened(o => !o)
  }

  return (
    <Popover
      withinPortal={true}
      trapFocus
      width={300}
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group spacing={0}>
          <ActionIcon color="red" onClick={() => setOpened(o => !o)}>
            <IconEdit size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <CommunityChangeRequestFormProvider form={form}>
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
                Update
              </Button>
            </Group>
          </form>
        </CommunityChangeRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateCommunityChangeRequest
