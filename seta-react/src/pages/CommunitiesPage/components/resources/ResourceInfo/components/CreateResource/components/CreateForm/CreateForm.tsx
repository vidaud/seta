import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import {
  useResource,
  type ResourceValues,
  ResourceFormProvider
} from '~/pages/CommunitiesPage/contexts/resource-context'

import { createResource } from '~/api/communities/manage/my-resource'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '30%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ id, close }) => {
  const { classes, cx } = useStyles()

  const form = useResource({
    initialValues: {
      resource_id: '',
      title: '',
      abstract: ''
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
    createResource(id, values)
      .then(() => {
        notifications.show({
          title: 'New Resource Added Successfully',
          message: 'New resource has been added to community',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.teal[6],
              borderColor: theme.colors.teal[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.teal[7] }
            }
          })
        })
      })
      .catch(error => {
        notifications.show({
          title: error.response.statusText,
          message: error.response.data.message,
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] }
            }
          })
        })
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
            withAsterisk
          />
          <Group position="right">
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
