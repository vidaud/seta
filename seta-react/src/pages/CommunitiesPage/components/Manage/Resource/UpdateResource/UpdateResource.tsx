import { useEffect } from 'react'
import { Paper, TextInput, Divider, Group, createStyles, Button, Textarea } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'

import { updateResource, useResourceID } from '../../../../../../api/resources/manage/my-resource'
import type { ResourceValues } from '../../../../contexts/resource-context'
import { ResourceFormProvider, useResource } from '../../../../contexts/resource-context'
import ComponentLoading from '../../../common/ComponentLoading'

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

const UpdateResource = () => {
  const { classes, cx } = useStyles()
  const { id } = useParams()
  const { resourceId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useResourceID(resourceId)

  const form = useResource({
    initialValues: {
      community_id: '',
      resource_id: '',
      title: '',
      abstract: '',
      status: 'active'
    },
    validate: values => ({
      resource_id: values.resource_id.length < 2 ? 'ID must have at least 2 letters' : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      abstract: values.abstract.length < 2 ? 'Too short abstract' : null
    })
  })

  useEffect(() => {
    if (data) {
      form.setValues(data)
    }
  }, [data])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const handleSubmit = (values: ResourceValues) => {
    updateResource(id, values.resource_id, values)
  }

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <ResourceFormProvider form={form}>
          <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my="xs" label="Update Resource" labelPosition="center" />
            <TextInput
              label="ID"
              {...form.getInputProps('resource_id')}
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
                onClick={() => {
                  navigate(-1)
                }}
              >
                Cancel
              </Button>

              <Button size="xs" type="submit">
                Update
              </Button>
            </Group>
          </form>
        </ResourceFormProvider>
      </Paper>
    </>
  )
}

export default UpdateResource
