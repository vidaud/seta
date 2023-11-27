import { useEffect, useState } from 'react'
import {
  Popover,
  Button,
  Group,
  createStyles,
  Text,
  NumberInput,
  Alert,
  Textarea
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import type { NewValueValues } from '~/pages/CommunitiesPage/contexts/change-request-context'
import {
  ChangeRequestFormProvider,
  useChangeRequest
} from '~/pages/CommunitiesPage/contexts/change-request-context'

import { useResourceChangeRequest } from '~/api/communities/resources/resource-change-requests'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const UpdateLimits = ({ props, nrResourcesChangeRequests }) => {
  const [opened, setOpened] = useState(false)
  const [requestNr, setRequestNumber] = useState(nrResourcesChangeRequests)
  const [updatedLimits, setUpdatedLimits] = useState(props?.limits)
  const { classes, cx } = useStyles()
  const setNewChangeRequestMutation = useResourceChangeRequest(props?.resource_id)

  const form = useChangeRequest({
    initialValues: {
      limits: {
        total_files_no: props?.limits?.total_files_no ? props?.limits?.total_files_no : 0,
        total_storage_mb: props?.limits?.total_storage_mb ? props?.limits?.total_storage_mb : 0,
        file_size_mb: props?.limits?.file_size_mb ? props?.limits?.file_size_mb : 0
      },
      message: 'test czxczxc dfsdfsd dsfsdfds'
    },
    validate: values => (
      setUpdatedLimits(values?.limits),
      {
        limits:
          JSON.stringify(props.limits) === JSON.stringify(values.limits)
            ? 'Field value is equal to current value'
            : null,
        message:
          values.message && values.message.length < 20
            ? 'message must have at least 20 letters'
            : null
      }
    )
  })

  useEffect(() => {
    setRequestNumber(nrResourcesChangeRequests)
  }, [nrResourcesChangeRequests])

  useEffect(() => {
    if (props) {
      form.setValues({
        limits: {
          total_files_no: props.limits.total_files_no,
          total_storage_mb: props.limits.total_storage_mb,
          file_size_mb: props.limits.file_size_mb
        },
        message: 'test czxczxc dfsdfsd dsfsdfds'
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, updatedLimits])

  const handleSubmit = (values: NewValueValues) => {
    const formValues = {
      field_name: 'limits',
      new_value: JSON.stringify(values.limits),
      old_value: JSON.stringify(props.limits)
    }

    setNewChangeRequestMutation.mutate(formValues, {
      onSuccess: () => {
        notifications.showSuccess(`Resource Limits Request Created!`, { autoClose: true })

        setOpened(o => !o)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        notifications.showError(error?.response?.data?.message, { autoClose: true })
      }
    })
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
        <Button
          size="xs"
          onClick={() => setOpened(o => !o)}
          disabled={requestNr > 0 ? true : false}
        >
          {requestNr === 0 ? 'Request Update Limits' : 'Request Pending'}
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <ChangeRequestFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {JSON.stringify(props?.limits) === JSON.stringify(updatedLimits) ? (
              <Alert
                mt="sm"
                variant="light"
                color="orange"
                title="Please Notice"
                icon={<IconInfoCircle />}
              >
                Resource has already a pending change request for this field
              </Alert>
            ) : null}
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

            <Textarea
              pt="xs"
              label="Message"
              placeholder="Please enter a justification for your request"
              {...form.getInputProps('message')}
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
