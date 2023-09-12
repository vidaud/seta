import { useEffect, useState } from 'react'
import { Checkbox } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useCommunityScopes } from '~/api/communities/communities/user-community-permissions'
import { useCategoryCatalogueScopes } from '~/api/communities/scope-catalogue-permissions'

const ManagePermissions = ({ props, id }) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes('community')
  const setCommunityScopesMutation = useCommunityScopes(id, props.user_id)

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const updateScopes = (values: string[]) => {
    setValue(values)
    const form = new FormData()

    values?.forEach(element => form.append('scope', element))
    setCommunityScopesMutation.mutate(form, {
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

export default ManagePermissions
