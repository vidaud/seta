import { useState } from 'react'
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

import { CommunityFormProvider, useCommunity } from '../community-context'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '30%'
  }
})

const items = [
  { title: 'My Communities', href: 'http://localhost/communities/my-list' },
  { title: 'Update Community' }
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
))

const UpdateCommunity = () => {
  const { classes, cx } = useStyles()
  const [dataType, setDataType] = useState('evidence')
  const [membership, setMembership] = useState('private')

  const form = useCommunity({
    initialValues: {
      communityId: 'Com1',
      title: 'Seta',
      description: 'This is a test community',
      dataType: 'Representative',
      membership: 'Private'
    }
  })

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto" maw={1000}>
        <CommunityFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              'empty'
            })}
          >
            <Divider my="xs" label="Update Community" labelPosition="center" />
            <TextInput
              label="ID"
              {...form.getInputProps('communityId')}
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
              <Radio.Group
                name="dataType"
                label="Data Type"
                {...form.getInputProps('dataType')}
                value={dataType}
                onChange={setDataType}
              >
                <Group mt="xs">
                  <Radio value="representative" label="Representative" />
                  <Radio value="evidence" label="Evidence" />
                </Group>
              </Radio.Group>
              <Radio.Group
                name="membership"
                label="Membership"
                {...form.getInputProps('membership')}
                value={membership}
                onChange={setMembership}
              >
                <Group mt="xs">
                  <Radio value="private" label="Private" />
                  <Radio value="public" label="Public" />
                </Group>
              </Radio.Group>
            </Group>
          </form>
        </CommunityFormProvider>
        <Group position="right">
          <Button variant="outline" size="xs" color="blue">
            Cancel
          </Button>
          <Button size="xs">Save</Button>
        </Group>
      </Paper>
    </>
  )
}

export default UpdateCommunity
