import { useEffect, useState } from 'react'
import { Checkbox, Group, Paper, Table, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

import {
  useListRestrictedResources,
  useSetRestrictedResources
} from '~/api/user/restricted-resources'

import ManageResources from './components/ManageResources'

import { useRestrictedResourcesListContext } from '../common/contexts/restricted-resources-list'

const RestrictedResourcesList = () => {
  const { data } = useListRestrictedResources()
  const [resources, setResources] = useState<string[]>()
  const { handleOpened } = useRestrictedResourcesListContext()

  const setRestrictedResourcesMutation = useSetRestrictedResources()

  const form = useForm({
    initialValues: { resource: resources }
  })

  useEffect(() => {
    const list: string[] = []

    if (data) {
      data?.forEach(item => {
        list.push(...[item?.resource_id])
      })
    }

    setResources(list)
  }, [data])

  const handleSubmit = () => {
    const request = new FormData()

    resources?.forEach(element => request.append('resource', element))

    setRestrictedResourcesMutation.mutate(request, {
      onSuccess: () => {
        notifications.show({
          message: `Restricted Resources List Updated!`,
          color: 'blue',
          autoClose: 5000
        })

        handleOpened(false)
      },
      onError: () => {
        notifications.show({
          message: 'Restricted Resources list update failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Paper shadow="xs" p="md" w="80%" style={{ alignSelf: 'center' }}>
      <Title order={4} ta="center" pb="5%">
        Manage Restricted Resources
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Checkbox.Group value={resources} onChange={setResources}>
          <Table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '5%' }}>Title</th>
                <th>Resource</th>
                <th>Community</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0
                ? data?.map(item => (
                    <tr key={item.resource_id}>
                      <td>
                        <Checkbox
                          sx={{ paddingBottom: '2px' }}
                          key={item.resource_id}
                          value={item.resource_id}
                          label={item.title}
                        />
                      </td>
                      <td>{item.resource_id}</td>
                      <td>{item.community_id}</td>
                    </tr>
                  ))
                : []}
            </tbody>
          </Table>
        </Checkbox.Group>

        <Group position="right" mt="lg">
          <ManageResources />
        </Group>
      </form>
    </Paper>
  )
}

export default RestrictedResourcesList
