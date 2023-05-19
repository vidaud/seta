import { useEffect } from 'react'
import {
  Paper,
  TextInput,
  Divider,
  Radio,
  Group,
  createStyles,
  Title,
  Button,
  Textarea,
  Anchor,
  Breadcrumbs
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import { updateResource, useResourceID } from '../../../../../../api/resources/manage/my-resource'
import CommunitiesLoading from '../../../common/SuggestionsLoading'
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

const items = [
  { title: 'My Communities', href: '/communities/my-list' },
  { title: 'Update Community' }
].map(item => (
  <Anchor href={item.href} key={item.title}>
    {item.title}
  </Anchor>
))

const UpdateResource = () => {
  const { classes, cx } = useStyles()
  const { id } = useParams()
  const { resourceId } = useParams()

  const { data, isLoading } = useResourceID(resourceId)

  const form = useResource({
    initialValues: {
      community_id: '',
      resource_id: '',
      title: '',
      abstract: ''
    }
  })

  useEffect(() => {
    if (data) {
      form.setValues(data)
    }
  }, [data])

  if (isLoading || !data) {
    return <CommunitiesLoading />
  }

  const handleSubmit = (values: ResourceValues) => {
    updateResource(id, values.resource_id, values)
  }

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <ResourceFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my="xs" label="Update Resource" labelPosition="center" />
            <TextInput
              label="ID"
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
            <Title order={5} className={cx(classes.input)}>
              To be approved
            </Title>
            <Group spacing={100} display="flex">
              <Radio.Group name="status" label="Status" {...form.getInputProps('status')}>
                <Group mt="xs">
                  <Radio value="active" label="Active" />
                  <Radio value="blocked" label="Blocked" />
                </Group>
              </Radio.Group>
            </Group>
            <Group position="right">
              <Button
                variant="outline"
                size="xs"
                color="blue"
                onClick={() => {
                  window.location.href = `/communities/details/${id}/${resourceId}`
                }}
              >
                Cancel
              </Button>
              <Button size="xs" type="submit">
                Save
              </Button>
            </Group>
          </form>
        </ResourceFormProvider>
      </Paper>
    </>
  )
}

export default UpdateResource
