import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Select, UnstyledButton } from '@mantine/core'
import { IconSwitch } from '@tabler/icons-react'

import { createCommunityChangeRequest } from '../../../../../../../api/communities/community-change-requests'
import type { NewValueValues } from '../../../../contexts/change-request-context'
import {
  ChangeRequestFormProvider,
  useChangeRequest
} from '../../../../contexts/change-request-context'

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
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // withinPortal={true}
      trapFocus
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
            <IconSwitch size="1rem" stroke={1.5} />
            {'  '} Request switch to {props.membership === 'closed' ? 'Opened' : 'Restricted'}
          </UnstyledButton>
        </Group>
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
                  setOpened(o => !o)
                  e.stopPropagation()
                }}
              >
                Cancel
              </Button>
              <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
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
