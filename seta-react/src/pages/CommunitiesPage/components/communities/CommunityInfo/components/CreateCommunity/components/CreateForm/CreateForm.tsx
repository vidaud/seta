import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '~/pages/CommunitiesPage/contexts/community-context'

import { createCommunity } from '~/api/communities/manage/my-community'

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

const CreateForm = ({ close, refetch }) => {
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
      .then(() => {
        close()
        refetch()
        notifications.show({
          title: 'New Community Added Successfully',
          message: 'New community has been added to the list',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.teal[6],
              borderColor: theme.colors.teal[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.teal[7] }
            }
          })
        })
      })
      .catch(error => {
        notifications.show({
          title: error.response.statusText,
          message: error.response.data.message,
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] }
            }
          })
        })
      })
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
