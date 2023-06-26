import { useEffect } from 'react'
import { TextInput, Group, createStyles, Button, Textarea } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'

import {
  updateCommunity,
  useMyCommunityID
} from '../../../../../../../../../api/communities/manage/my-community'
import { ComponentLoading } from '../../../../../../../components/common'
import type { CommunityValues } from '../../../../../../../contexts/community-context'
import {
  CommunityFormProvider,
  useCommunity
} from '../../../../../../../contexts/community-context'

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

const UpdateForm = ({ id }) => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()

  const { data, isLoading } = useMyCommunityID(id)

  const form = useCommunity({
    initialValues: {
      community_id: '',
      title: '',
      description: '',
      data_type: 'evidence',
      status: 'active'
    },
    validate: values => ({
      community_id: values.community_id.length < 2 ? 'ID must have at least 2 letters' : null,
      title: values.title.length < 2 ? 'Too short title' : null,
      description: values.description.length < 2 ? 'Too short description' : null,
      data_type: values.data_type.length < 1 ? 'Please select data type' : null
    })
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
      <CommunityFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="ID"
            {...form.getInputProps('community_id')}
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
            <Link className={classes.link} to={`/my-communities/${id}`} replace={true}>
              <Button
                variant="outline"
                size="xs"
                color="blue"
                onClick={() => {
                  navigate(-1)
                }}
              >
                Cancel
              </Button>
            </Link>

            <Button size="xs" type="submit">
              Update
            </Button>
          </Group>
        </form>
      </CommunityFormProvider>
    </>
  )
}

export default UpdateForm
