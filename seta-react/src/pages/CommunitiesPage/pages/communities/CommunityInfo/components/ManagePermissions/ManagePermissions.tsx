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

import { manageCommunityScopes } from '../../../../../../../api/communities/user-community-permissions'
import type { CommunityPermissions } from '../../../../../contexts/community-user-permissions'
import {
  CommunityPermissionsFormProvider,
  useCommunityPermissions
} from '../../../../../contexts/community-user-permissions'

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
  { label: 'Community Owner', value: '/seta/community/owner' },
  { label: 'Community Manager', value: '/seta/community/manager' },
  { label: 'Community Invite', value: '/seta/community/invite' },
  { label: 'Membership Approve', value: '/seta/community/membership/approve' },
  { label: 'Create Resource', value: '/seta/resource/create' }
]

const ManagePermissions = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()
  const { id } = useParams()

  const form = useCommunityPermissions({
    initialValues: {
      scope: []
    }
  })

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const handleSubmit = (values: CommunityPermissions) => {
    manageCommunityScopes(id, props.user_id, values)
    setOpened(o => !o)
  }

  return (
    <Popover
      position="left"
      withArrow
      trapFocus
      width={300}
      withinPortal={true}
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Manage Membership">
            <ActionIcon>
              <IconPencil size="1rem" stroke={1.5} onClick={() => setOpened(o => !o)} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Popover.Target>
      <Popover.Dropdown className={cx(classes.dropdown)}>
        <CommunityPermissionsFormProvider form={form}>
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
        </CommunityPermissionsFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ManagePermissions
