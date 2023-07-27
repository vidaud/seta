import { useEffect, useState } from 'react'
import { Checkbox } from '@mantine/core'

import { useCategoryCatalogueScopes } from '../../../../../../../api/communities/scope-catalogue-permissions'
import { manageResourceScopes } from '../../../../../../../api/communities/user-resource-permissions'

const ManageResourcePermissions = ({ props, id }) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes('resource')

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
    manageResourceScopes(id, props.user_id, form)
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
