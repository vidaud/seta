import { useEffect, useState } from 'react'
import { Checkbox } from '@mantine/core'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import { useCommunityScopes } from '~/api/communities/communities/user-community-permissions'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'
import { notifications } from '~/utils/notifications'

const ManagePermissions = ({ props, id }) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes(ScopeCategory.Community)
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
        notifications.showSuccess(`Permissions updated successfully!`, { autoClose: true })
      },
      onError: () => {
        notifications.showError('Permissions update failed!', { autoClose: true })
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
