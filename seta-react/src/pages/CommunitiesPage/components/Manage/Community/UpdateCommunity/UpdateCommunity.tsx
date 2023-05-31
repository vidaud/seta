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

import {
  updateCommunity,
  useCommunityID
} from '../../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../../common/ComponentLoading'
import type { CommunityValues } from '../../community-context'
import { CommunityFormProvider, useCommunity } from '../../community-context'

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

const UpdateCommunity = () => {
  const { classes, cx } = useStyles()
  const { id } = useParams()

  const { data, isLoading } = useCommunityID(id)

  const form = useCommunity({
    initialValues: {
      community_id: '',
      title: '',
      description: '',
      data_type: '',
      status: ''
    }
  })

  useEffect(() => {
    if (data) {
      form.setValues(data.communities)
    }
  }, [data])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const handleSubmit = (values: CommunityValues) => {
    updateCommunity(values.community_id, values)
  }

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <CommunityFormProvider form={form}>
          <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my="xs" label="Update Community" labelPosition="center" />
            <TextInput
              label="ID"
              {...form.getInputProps('community_id')}
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
              label="Description"
              {...form.getInputProps('description')}
              className={cx(classes.input)}
            />
            <Group spacing={100} display="flex">
              <Radio.Group name="data_type" label="Data Type" {...form.getInputProps('data_type')}>
                <Group mt="xs">
                  <Radio value="representative" label="Representative" />
                  <Radio value="evidence" label="Evidence" />
                </Group>
              </Radio.Group>
              <Radio.Group name="status" label="Status" {...form.getInputProps('status')}>
                <Group mt="xs">
                  <Radio value="active" label="Active" />
                  <Radio value="blocked" label="Blocked" />
                </Group>
              </Radio.Group>
            </Group>
            <Group position="right">
              <Link className={classes.link} to={`/my-communities/${id}`} replace={true}>
                <Button variant="outline" size="xs" color="blue">
                  Cancel
                </Button>
              </Link>

              <Button size="xs" type="submit">
                Save
              </Button>
            </Group>
          </form>
        </CommunityFormProvider>
      </Paper>
    </>
  )
}

export default UpdateCommunity
