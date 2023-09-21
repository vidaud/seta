import { forwardRef } from 'react'
import { Select, Box, Text, Group, Loader, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAt } from '@tabler/icons-react'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useActiveUserInfos } from '~/api/admin/users'

type Props = {
  communityId?: string
  onSubmit?(communityId?: string, ownerId?: string): void
}

type ItemProps = {
  label: string
  email: string
} & React.ComponentPropsWithoutRef<'div'>

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, email, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text fw={600}>{label}</Text>
      <Group noWrap spacing={3} mt={3}>
        <IconAt stroke={1.5} size="1rem" color="gray" />
        <Text fz="xs" c="dimmed">
          {email}
        </Text>
      </Group>
    </div>
  )
)

const OwnerForm = ({ communityId, onSubmit }: Props) => {
  const { data, isLoading, error, refetch } = useActiveUserInfos()

  const users = (data ?? []).map(item => ({
    label: item.fullName,
    email: item.email,
    value: item.username
  }))

  const form = useForm({
    initialValues: { username: '' },

    // functions will be used to validate values at corresponding key
    validate: {
      username: value => (!value ? 'Select an user' : null)
    }
  })

  if (error) {
    return <SuggestionsError subject="users" onTryAgain={refetch} />
  }

  const handleSubmit = (values: { username: string }) => {
    onSubmit?.(communityId, values.username)
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label={`Select a new owner for ${communityId}:`}
          placeholder="Search by name or email..."
          itemComponent={SelectItem}
          data={users}
          searchable
          clearable
          maxDropdownHeight={400}
          nothingFound="No user found"
          disabled={isLoading}
          rightSection={isLoading ? <Loader size="1rem" /> : null}
          withinPortal
          filter={(value, item) =>
            item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.email?.toLowerCase().includes(value.toLowerCase().trim())
          }
          {...form.getInputProps('username')}
        />
        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>
    </Box>
  )
}

export default OwnerForm
