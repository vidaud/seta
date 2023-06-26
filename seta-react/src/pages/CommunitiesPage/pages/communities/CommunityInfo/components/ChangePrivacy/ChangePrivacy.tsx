import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Tooltip, Select } from '@mantine/core'

import { createCommunityChangeRequest } from '../../../../../../../api/communities/community-change-requests'
import type { NewValueValues } from '../../../../../contexts/change-request-context'
import {
  ChangeRequestFormProvider,
  useChangeRequest
} from '../../../../../contexts/change-request-context'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const membershipOptions = [
  { label: 'Restricted', value: 'closed' },
  { label: 'Opened', value: 'opened' }
]

const ChangePrivacy = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useChangeRequest({
    initialValues: {
      membership: ''
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues({
        membership: props.membership
      })
    }
  }, [props])

  const handleSubmit = (values: NewValueValues) => {
    const formValues = {
      field_name: 'membership',
      new_value: values.membership,
      old_value: props.membership
    }

    createCommunityChangeRequest(props.community_id, formValues)
    setOpened(o => !o)
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Tooltip label="Change community privacy">
          <Button size="xs" onClick={() => setOpened(o => !o)}>
            Update Privacy
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <ChangeRequestFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Select
              {...form.getInputProps('membership')}
              label="Privacy"
              name="membership"
              data={membershipOptions}
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
        </ChangeRequestFormProvider>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ChangePrivacy
