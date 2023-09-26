import { TextInput, Group, createStyles, Button, Textarea, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import type { AxiosError } from 'axios'
import { MdSettingsEthernet } from 'react-icons/md'

import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '~/pages/CommunitiesPage/contexts/community-context'

import { useCreateCommunity } from '~/api/communities/communities/my-community'
import { useUserPermissions } from '~/api/communities/user-scopes'
import { useCurrentUser } from '~/contexts/user-context'

import { getCommunityID } from '../../utils'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  form: {
    textAlign: 'left'
  }
})

const CreateForm = ({ close }) => {
  const { classes, cx } = useStyles()
  const { refetch } = useUserPermissions()
  const setCreateCommunityMutation = useCreateCommunity()
  const { user } = useCurrentUser()

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.show({
          message: error?.response?.data?.message,
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
          <Group>
            <TextInput
              label="ID"
              description="ID should be unique. Once saved, you will not be able to update it. You can generate a random ID by clicking on <...>"
              {...form.getInputProps('community_id')}
              className={cx(classes.input, classes.sized)}
              placeholder="Example: institution-user-randomId ..."
              withAsterisk
              data-autofocus
            />
            <Tooltip label="Generate Community ID">
              <Button
                sx={{ marginTop: '9%' }}
                onClick={() => {
                  form.setValues({
                    community_id: getCommunityID(user)
                  })
                }}
              >
                <MdSettingsEthernet size={24} />
              </Button>
            </Tooltip>
          </Group>
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
