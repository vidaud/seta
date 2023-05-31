import { Paper, TextInput, Divider, Group, createStyles, Button, Textarea } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'

import { createResource } from '../../../../../../api/resources/manage/my-resource'
import type { ResourceValues } from '../../resource-context'
import { ResourceFormProvider, useResource } from '../../resource-context'

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

const NewResource = () => {
  const { classes, cx } = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useResource({
    initialValues: {
      community_id: id ? id : '',
      resource_id: '',
      title: '',
      abstract: ''
    },
    validate: values => ({
      resource_id: values.resource_id.length < 2 ? 'ID must have at least 2 letters' : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      abstract: values.abstract.length < 2 ? 'Too short abstract' : null
    })
  })

  const handleSubmit = (values: ResourceValues) => {
    createResource(values.community_id, values)
  }

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <ResourceFormProvider form={form}>
          <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my="xs" label="Add New Resource" labelPosition="center" />
            <TextInput
              label="Community ID"
              {...form.getInputProps('community_id')}
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
                  navigate(-1)
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
      </Paper>
    </>
  )
}

export default NewResource
