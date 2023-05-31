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
import { useNavigate } from 'react-router-dom'

import { createCommunity } from '../../../../../../api/communities/manage/my-community'
import type { CommunityValues } from '../../community-context'
import { useCommunity, CommunityFormProvider } from '../../community-context'

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

const NewCommunity = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()

  const form = useCommunity({
    initialValues: {
      community_id: '',
      title: '',
      description: '',
      data_type: '',
      status: 'active'
    },
    validate: values => ({
      community_id: values.community_id.length < 2 ? 'ID must have at least 2 letters' : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      description: values.description.length < 2 ? 'Too short description' : null,
      data_type: values.data_type.length < 1 ? 'Please select data type' : null
    })
  })

  const handleSubmit = (values: CommunityValues) => {
    createCommunity(values)
  }

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <CommunityFormProvider form={form}>
          <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my="xs" label="Add New Community" labelPosition="center" />
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
              withAsterisk
            />
            <Group spacing={100} display="flex">
              <Radio.Group name="data_type" label="Data Type" {...form.getInputProps('data_type')}>
                <Group mt="xs">
                  <Radio value="representative" label="Representative" />
                  <Radio value="evidence" label="Evidence" />
                </Group>
              </Radio.Group>
            </Group>
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
        </CommunityFormProvider>
      </Paper>
    </>
  )
}

export default NewCommunity
