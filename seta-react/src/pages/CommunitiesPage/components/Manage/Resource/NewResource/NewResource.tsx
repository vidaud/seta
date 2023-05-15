import {
  Paper,
  TextInput,
  Divider,
  Group,
  createStyles,
  Button,
  Textarea,
  Anchor,
  Breadcrumbs
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import { createResource } from '../../../../../../api/communities/resource'
import type { ResourceValues } from '../../resource-context'
import { ResourceFormProvider, useResource } from '../../resource-context'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '30%'
  }
})

const NewResource = () => {
  const { classes, cx } = useStyles()
  const { id } = useParams()

  const items = [
    { title: 'My Communities', href: 'http://localhost/communities/my-list' },
    { title: `${id}` },
    { title: 'New Resource' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  const form = useResource({
    initialValues: {
      community_id: id ? id : '',
      resource_id: '',
      title: '',
      abstract: ''
    }
  })

  const handleSubmit = (values: ResourceValues) => {
    createResource(values.community_id, values)
  }

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <ResourceFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
            />
            <Group position="right">
              <Button
                variant="outline"
                size="xs"
                color="blue"
                onClick={() => {
                  form.reset()
                  window.location.href = '/communities/details/' + `${id}`
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
