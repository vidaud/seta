import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '~/pages/CommunitiesPage/contexts/community-context'

import { useCreateCommunity } from '~/api/communities/communities/my-community'
import { useUserPermissions } from '~/api/communities/user-scopes'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '60%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ close }) => {
  const { classes, cx } = useStyles()
  const { refetch } = useUserPermissions()
  const setCreateCommunityMutation = useCreateCommunity()

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
    setCreateCommunityMutation.mutate(values, {
      onSuccess: () => {
        notifications.show({
          message: `Community Created Successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        refetch()
        close()
      },
      onError: () => {
        notifications.show({
          message: 'Create community failed!',
          color: 'red',
          autoClose: 5000
        })
      }
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
            data-autofocus
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
