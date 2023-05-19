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

import { createCommunity } from '../../../../../../api/communities/manage/my-community'
import type { CommunityValues } from '../../community-context'
import { useCommunity, CommunityFormProvider } from '../../community-context'

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
  { title: 'New Community' }
].map(item => (
  <Anchor href={item.href} key={item.title}>
    {item.title}
  </Anchor>
))

const NewCommunity = () => {
  const { classes, cx } = useStyles()

  const form = useCommunity({
    initialValues: {
      community_id: '',
      title: '',
      description: '',
      data_type: '',
      status: 'active'
    }
  })

  const handleSubmit = (values: CommunityValues) => {
    createCommunity(values)
  }

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <CommunityFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
            />
            <Title order={5} className={cx(classes.input)}>
              To be approved
            </Title>
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
                  window.location.href = '/communities/my-list'
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
