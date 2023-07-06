import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Select, ActionIcon } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

import { updateResourceChangeRequest } from '../../../../../../api/communities/resource-change-requests'
import type { ResourceChangeRequestValues } from '../../../../../CommunitiesPage/pages/contexts/resource-change-request-context'
import {
  ResourceChangeRequestFormProvider,
  useResourceChangeRequest
} from '../../../../../CommunitiesPage/pages/contexts/resource-change-request-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})
const statusOptions = [
  { label: 'approved', value: 'approved' },
  { label: 'rejected', value: 'rejected' }
]

const UpdateResourceChangeRequest = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useResourceChangeRequest({
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

  const handleSubmit = (values: ResourceChangeRequestValues) => {
    updateResourceChangeRequest(props.resource_id, props.request_id, values)
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
        <ResourceChangeRequestFormProvider form={form}>
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
        </ResourceChangeRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UpdateResourceChangeRequest
