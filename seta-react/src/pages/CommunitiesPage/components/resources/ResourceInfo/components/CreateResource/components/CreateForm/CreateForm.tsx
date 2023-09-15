import { TextInput, Group, createStyles, Button, Textarea, Radio } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import {
  useResource,
  type ResourceValues,
  ResourceFormProvider
} from '~/pages/CommunitiesPage/contexts/resource-context'

import { useCreateResource } from '~/api/communities/resources/my-resource'

import ResourceAlert from '../../../ResourceAlert'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '50%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ id, close }) => {
  const { classes, cx } = useStyles()
  const setNewResourceMutation = useCreateResource(id)

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
        notifications.show({
          message: `New Resource Added Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        close()
      },
      onError: () => {
        notifications.show({
          message: 'Create New Resource Failed!',
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
            label="Community ID"
            value={id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
          />
          <TextInput
            label="Resource ID"
            {...form.getInputProps('resource_id')}
            className={cx(classes.input, classes.sized)}
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
            autosize
            withAsterisk
          />
          <Group spacing={100} display="flex" mb="md">
            <Radio.Group name="type" label="Type" {...form.getInputProps('type')}>
              <Group mt="xs">
                <Radio value="discoverable" label="Discoverable" />
                <Radio value="representative" label="Representative" />
              </Group>
            </Radio.Group>
          </Group>
          <ResourceAlert variant="resource-type" />
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
