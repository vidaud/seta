import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'

import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '~/pages/CommunitiesPage/contexts/community-context'

import { useSetUpdateCommunity } from '~/api/communities/communities/my-community'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  link: {
    color: '#228be6'
  },
  form: {
    textAlign: 'left'
  }
})

const UpdateForm = ({ community, close, onChange }) => {
  const { classes, cx } = useStyles()
  const setUpdateCommunityMutation = useSetUpdateCommunity(community.community_id)

  const form = useCommunity({
    initialValues: {
      title: '',
      description: '',
      status: 'active'
    },
    validate: values => ({
      title: values.title.length < 2 ? 'Too short title' : null,
      description: values.description.length < 2 ? 'Too short description' : null
    })
  })

  useEffect(() => {
    if (community) {
      form.setValues({
        title: community.title,
        description: community.description
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community])

  const handleSubmit = (values: CommunityValues) => {
    setUpdateCommunityMutation.mutate(values, {
      onSuccess: () => {
        notifications.showSuccess(`Community Updated Successfully!`, { autoClose: true })

        close()
      },
      onError: () => {
        notifications.showError('Community update failed!', { autoClose: true })
      }
    })
  }

  return (
    <>
      <CommunityFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="ID"
            description="ID is unique. You are not able to update it anymore."
            value={community.community_id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
            withAsterisk
          />
          <TextInput
            label="Title"
            description="This field should be unique. Once saved, the title can still be updated"
            {...form.getInputProps('title')}
            placeholder="Enter title ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Textarea
            label="Description"
            {...form.getInputProps('description')}
            placeholder="Enter description ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <Group position="right">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                close()
                onChange(true)
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>

            <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
              Update
            </Button>
          </Group>
        </form>
      </CommunityFormProvider>
    </>
  )
}

export default UpdateForm
