import { useEffect, useState } from 'react'
import { Checkbox } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useCategoryCatalogueScopes } from '~/api/communities/scope-catalogue-permissions'
import { useResourceScopes } from '~/api/communities/user-resource-permissions'

const ManageResourcePermissions = ({ props, id }) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes('resource')
  const setResourceScopesMutation = useResourceScopes(id, props.user_id)

  useEffect(() => {
    if (props) {
      setValue(props.scopes)
      // form.setValues(props)
    }
  }, [props])

  const updateScopes = (values: string[]) => {
    setValue(values)
    const form = new FormData()

    values?.forEach(element => form.append('scope', element))
    setResourceScopesMutation.mutate(form, {
      onSuccess: () => {
        notifications.show({
          message: `Permissions updated successfully!`,
          color: 'blue',
          autoClose: 5000
        })
      },
      onError: () => {
        notifications.show({
          message: 'Permissions update failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Checkbox.Group
      value={value}
      onChange={e => {
        updateScopes(e)
      }}
    >
      {data
        ? data?.map(scope => (
            <Checkbox
              sx={{ paddingBottom: '2px' }}
              key={scope.code}
              value={scope.code}
              label={scope.name}
            />
          ))
        : []}
    </Checkbox.Group>
  )
}

export default ManageResourcePermissions
