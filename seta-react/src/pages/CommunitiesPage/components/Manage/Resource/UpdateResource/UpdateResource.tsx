import { useEffect } from 'react'
import {
  Paper,
  TextInput,
  Divider,
  Radio,
  Group,
  createStyles,
  Button,
  Textarea
} from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import { updateResource, useResourceID } from '../../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../../common/ComponentLoading'
import type { ResourceValues } from '../../resource-context'
import { ResourceFormProvider, useResource } from '../../resource-context'

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
            <Group spacing={100} display="flex">
              <Radio.Group name="status" label="Status" {...form.getInputProps('status')}>
                <Group mt="xs">
                  <Radio value="active" label="Active" />
                  <Radio value="blocked" label="Blocked" />
                </Group>
              </Radio.Group>
            </Group>
            <Group position="right">
              <Link className={classes.link} to={`/my-resources/${resourceId}`} replace={true}>
                <Button variant="outline" size="xs" color="blue">
                  Cancel
                </Button>
              </Link>
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
