import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'

import { createCommunity } from '../../../../../../../../../api/communities/manage/my-community'
import type { CommunityValues } from '../../../../../../contexts/community-context'
import { useCommunity, CommunityFormProvider } from '../../../../../../contexts/community-context'

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

const CreateForm = ({ close }) => {
  const { classes, cx } = useStyles()

  const form = useCommunity({
    initialValues: {
      community_id: '',
      title: '',
      description: ''
    },
    validate: values => ({
      community_id:
        values.community_id && values.community_id.length < 2
          ? 'ID must have at least 2 letters'
          : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      description: values.description.length < 2 ? 'Too short description' : null
    })
  })

  const handleSubmit = (values: CommunityValues) => {
    createCommunity(values)
  }

  return (
    <>
      <CommunityFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
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
          {/* <Group spacing={100} display="flex">
              <Radio.Group name="data_type" label="Data Type" {...form.getInputProps('data_type')}>
                <Group mt="xs">
                  <Radio value="representative" label="Representative" />
                  <Radio value="evidence" label="Evidence" />
                </Group>
              </Radio.Group>
            </Group> */}
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
      </CommunityFormProvider>
    </>
  )
}

export default CreateForm
