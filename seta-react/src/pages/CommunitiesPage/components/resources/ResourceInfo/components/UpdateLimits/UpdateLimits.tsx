import { useEffect, useState } from 'react'
import { Popover, Button, Group, createStyles, Text, NumberInput } from '@mantine/core'

import { createResourceChangeRequest } from '../../../../../../../api/communities/resource-change-requests'
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

const UpdateLimits = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()

  const form = useChangeRequest({
    initialValues: {
      limits: {
        total_files_no: 0,
        total_storage_mb: 0,
        file_size_mb: 0
      }
    }
  })

  useEffect(() => {
    if (props) {
      form.setValues({
        limits: {
          total_files_no: props.limits.total_files_no,
          total_storage_mb: props.limits.total_storage_mb,
          file_size_mb: props.limits.file_size_mb
        }
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const handleSubmit = (values: NewValueValues) => {
    const formValues = {
      field_name: 'limits',
      new_value: JSON.stringify(values.limits),
      old_value: JSON.stringify(props.limits)
    }

    // form.setValues({ new_value: form.values})
    createResourceChangeRequest(props.resource_id, formValues)
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
        <Button size="xs" onClick={() => setOpened(o => !o)}>
          Request Update Limits
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <ChangeRequestFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Text>Limits</Text>
            <NumberInput
              type="number"
              label="Total Files No"
              {...form.getInputProps('limits.total_files_no')}
              withAsterisk
            />
            <NumberInput
              type="number"
              label="Total Storage Mb"
              {...form.getInputProps('limits.total_storage_mb')}
              withAsterisk
            />
            <NumberInput
              label="File Size Mb"
              {...form.getInputProps('limits.file_size_mb')}
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

export default UpdateLimits
