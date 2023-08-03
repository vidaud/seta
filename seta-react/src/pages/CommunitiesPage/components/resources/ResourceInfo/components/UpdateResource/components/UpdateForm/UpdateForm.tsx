import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'

import { ComponentLoading } from '~/pages/CommunitiesPage/components/common'
import type { ResourceValues } from '~/pages/CommunitiesPage/contexts/resource-context'
import {
  ResourceFormProvider,
  useResource
} from '~/pages/CommunitiesPage/contexts/resource-context'

import { updateResource, useResourceID } from '~/api/communities/manage/my-resource'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '30%'
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

  const { data, isLoading } = useResourceID(resource.resource_id)

  const form = useResource({
    initialValues: {
      title: '',
      abstract: '',
      status: 'active'
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
        abstract: resource.abstract
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const handleSubmit = (values: ResourceValues) => {
    updateResource(resource.resource_id, values)
  }

  return (
    <>
      <ResourceFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="ID"
            {...form.getInputProps('resource_id')}
            value={resource.resource_id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
            withAsterisk
          />
          <TextInput
            label="Title"
            {...form.getInputProps('title')}
            className={cx(classes.input)}
            withAsterisk
          />
          <Textarea
            label="Abstract"
            {...form.getInputProps('abstract')}
            className={cx(classes.input)}
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