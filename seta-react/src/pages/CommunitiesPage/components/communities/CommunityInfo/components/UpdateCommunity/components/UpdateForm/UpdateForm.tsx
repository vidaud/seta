import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'

import { ComponentLoading } from '~/pages/CommunitiesPage/components/common'
import type { CommunityValues } from '~/pages/CommunitiesPage/contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '~/pages/CommunitiesPage/contexts/community-context'

import { updateCommunity, useCommunityID } from '~/api/communities/manage/my-community'

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

const UpdateForm = ({ community, close, onChange, refetch }) => {
  const { classes, cx } = useStyles()

  const { data, isLoading } = useCommunityID(community.community_id)

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
  }, [community, data])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const handleSubmit = (values: CommunityValues) => {
    updateCommunity(community.community_id, values).then(() => {
      refetch()
      close()
    })
  }

  return (
    <>
      <CommunityFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="ID"
            value={community.community_id}
            className={cx(classes.input, classes.sized)}
            disabled={true}
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
