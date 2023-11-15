import { useState } from 'react'
import { TextInput, Group, createStyles, Button, Textarea, Radio } from '@mantine/core'
import type { AxiosError } from 'axios'
import { IoIosInformationCircle } from 'react-icons/io'

import ResourceAlert from '~/pages/CommunitiesPage/components/resources/ResourceInfo/components/ResourceAlert'
import {
  useResource,
  type ResourceValues,
  ResourceFormProvider
} from '~/pages/CommunitiesPage/contexts/resource-context'

import { useCreateResource } from '~/api/communities/resources/my-resource'
import { useUserPermissions } from '~/api/communities/user-scopes'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ id, close }) => {
  const { classes, cx } = useStyles()
  const setNewResourceMutation = useCreateResource(id)
  const { refetch } = useUserPermissions()
  const [opened, setOpened] = useState<boolean>(false)

  const form = useResource({
    initialValues: {
      resource_id: '',
      title: '',
      abstract: '',
      type: 'discoverable'
    },
    validate: values => ({
      resource_id:
        values.resource_id && values.resource_id.length < 2
          ? 'ID must have at least 2 letters'
          : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      abstract: values.abstract.length < 2 ? 'Too short abstract' : null
    })
  })

  const handleSubmit = (values: ResourceValues) => {
    setNewResourceMutation.mutate(values, {
      onSuccess: () => {
        notifications.showSuccess(`New Resource Added Successfully!`, { autoClose: true })

        refetch()
        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.showError('Create Resource Failed!', {
          description: error?.response?.data?.message,
          autoClose: true
        })
      }
    })
  }

  return (
    <>
      <ResourceFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Community ID"
            description="Community ID is unique. You are not able to update it anymore."
            value={id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
          />
          <TextInput
            label="Resource ID"
            description="Resource ID should be unique. Once saved, you will not be able to update it."
            {...form.getInputProps('resource_id')}
            placeholder="Enter resource ID ..."
            className={cx(classes.input, classes.sized)}
            withAsterisk
          />
          <TextInput
            label="Title"
            description="This field should be unique. Once saved, the title can still be updated"
            {...form.getInputProps('title')}
            placeholder="Enter title ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Textarea
            label="Abstract"
            {...form.getInputProps('abstract')}
            className={cx(classes.input)}
            placeholder="Enter abstract ..."
            autosize
            withAsterisk
          />
          <Group spacing={100} display="flex" mb="md">
            <Radio.Group name="type" label="Type" {...form.getInputProps('type')}>
              <IoIosInformationCircle
                size={20}
                color="gray"
                onClick={() => {
                  setOpened(o => !o)
                }}
              />
              <Group>
                <Group mt="xs" sx={{ display: 'grid' }}>
                  <Radio
                    value="discoverable"
                    label="Discoverable"
                    onClick={() => {
                      setOpened(false)
                    }}
                  />
                  <Radio
                    value="representative"
                    label="Representative"
                    onClick={() => {
                      setOpened(true)
                    }}
                  />
                </Group>
                {opened ? <ResourceAlert variant="resource-type" /> : null}
              </Group>
            </Radio.Group>
          </Group>

          <Group position="right" mt="md">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={() => {
                form.reset()
                close()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="xs">
              Save
            </Button>
          </Group>
        </form>
      </ResourceFormProvider>
    </>
  )
}

export default CreateForm
