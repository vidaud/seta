import { useEffect, useState } from 'react'
import { Checkbox, Table } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import { useResourceScopes } from '~/api/communities/resources/user-resource-permissions'
import type { UserPermissionsResponse } from '~/api/types/user-permissions-types'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

type Props = {
  id: string
  props: UserPermissionsResponse
  scopes?: string[]
}

const ManageResourcePermissions = ({ props, id, scopes }: Props) => {
  const [value, setValue] = useState<string[]>(props.scopes)
  const { data } = useCategoryCatalogueScopes(ScopeCategory.Resource)
  const setResourceScopesMutation = useResourceScopes(id, props.user_id)
  const [scopeValue] = useState<string[] | undefined>(scopes)

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
    <>
      {scopeValue?.includes('/seta/resource/edit') ? (
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
      ) : (
        <Table>
          <tbody>
            <>
              {data
                ? data?.map(scope => (
                    <tr key={scope.code}>
                      <td style={{ border: 'none', padding: 0 }}>{scope?.name}</td>
                    </tr>
                  ))
                : []}
            </>
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ManageResourcePermissions
