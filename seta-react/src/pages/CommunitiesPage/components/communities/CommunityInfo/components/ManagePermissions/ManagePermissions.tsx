import { useEffect, useState } from 'react'
import { Checkbox } from '@mantine/core'

import { useCategoryCatalogueScopes } from '~/api/communities/scope-catalogue-permissions'
import { manageCommunityScopes } from '~/api/communities/user-community-permissions'

const ManagePermissions = ({ props, id }) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes('community')

  useEffect(() => {
    if (props) {
      // form.setValues(props)
    }
  }, [props])

  const updateScopes = (values: string[]) => {
    setValue(values)
    const form = new FormData()

    values?.forEach(element => form.append('scope', element))
    manageCommunityScopes(id, props.user_id, form)
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
