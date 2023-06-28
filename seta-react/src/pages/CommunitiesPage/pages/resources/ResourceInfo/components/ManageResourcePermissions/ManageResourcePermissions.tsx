import { useEffect, useState } from 'react'
import {
  Popover,
  Button,
  Group,
  createStyles,
  Tooltip,
  ActionIcon,
  MultiSelect
} from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'

import { manageResourceScopes } from '../../../../../../../api/communities/user-resource-permissions'
import type { ResourcePermissions } from '../../../../contexts/resource-user-permissions'
import {
  ResourcePermissionsFormProvider,
  useResourcePermissions
} from '../../../../contexts/resource-user-permissions'

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
const scopeOptions = [
  { label: 'Add Resource', value: '/seta/resource/data/add' },
  { label: 'Edit Resource', value: '/seta/resource/edit' },
  { label: 'Delete Resource', value: '/seta/resource/data/delete' }
]

const ManageResourcePermissions = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()
  const { id } = useParams()

  const form = useResourcePermissions({
    initialValues: {
      scope: []
    }
  })

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: ResourcePermissions) => {
    manageResourceScopes(id, props.user_id, values)
    setOpened(o => !o)
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      position="left"
      trapFocus
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Manage Permissions" color="gray">
            <ActionIcon>
              <IconPencil size="1rem" stroke={1.5} onClick={() => setOpened(o => !o)} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Popover.Target>
      <Popover.Dropdown className={cx(classes.dropdown)}>
        <ResourcePermissionsFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <MultiSelect
              multiple
              {...form.getInputProps('scope')}
              label="Scope"
              name="scope"
              data={scopeOptions}
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
        </ResourcePermissionsFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ManageResourcePermissions
