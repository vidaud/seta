import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import type { ResourceValues } from '~/pages/CommunitiesPage/contexts/resource-context'
import {
  ResourceFormProvider,
  useResource
} from '~/pages/CommunitiesPage/contexts/resource-context'

import { useSetUpdateResource } from '~/api/communities/resources/my-resource'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  link: {
    color: '#228be6'
  },
  form: {
    textAlign: 'left'
  }
})

const UpdateForm = ({ resource, close, onChange }) => {
  const { classes, cx } = useStyles()

  const setUpdateResourceMutation = useSetUpdateResource(resource.resource_id)

  const form = useResource({
    initialValues: {
      title: '',
      abstract: '',
      status: 'active',
      type: 'discoverable'
    },
    validate: values => ({
      title: values.title.length < 2 ? 'Too short title' : null,
      abstract: values.abstract.length < 2 ? 'Too short abstract' : null
    })
  })

  useEffect(() => {
    if (resource) {
      form.setValues({
        title: resource.title,
        abstract: resource.abstract,
        type: resource.type
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  const handleSubmit = (values: ResourceValues) => {
    setUpdateResourceMutation.mutate(values, {
      onSuccess: () => {
        notifications.show({
          message: `Resource Updated Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        close()
      },
      onError: () => {
        notifications.show({
          message: 'Resource update failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <>
      <ResourceFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="ID"
            {...form.getInputProps('resource_id')}
            description="ID is unique. You are not able to update it anymore."
            value={resource.resource_id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
            withAsterisk
          />
          <TextInput
            label="Title"
            {...form.getInputProps('title')}
            description="This field should be unique. Once saved, the title can still be updated"
            className={cx(classes.input)}
            placeholder="Enter title ..."
            withAsterisk
          />
          <Textarea
            label="Abstract"
            {...form.getInputProps('abstract')}
            className={cx(classes.input)}
            placeholder="Enter abstract ..."
            withAsterisk
          />
          <Group position="right">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                close()
                e.stopPropagation()
                onChange(true)
              }}
            >
              Cancel
            </Button>

            <Button
              size="xs"
              type="submit"
              onClick={e => {
                e.stopPropagation()
              }}
            >
              Update
            </Button>
          </Group>
        </form>
      </ResourceFormProvider>
    </>
  )
}

export default UpdateForm
