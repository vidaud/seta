import { useState, useRef } from 'react'
import { Button, Group, Title } from '@mantine/core'
import { IconCheckbox } from '@tabler/icons-react'

import ApiLoader from '~/pages/Admin/common/components/Loader'
import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useUpdateAccountPermissions } from '~/api/admin/user'
import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import type { SystemScope } from '~/types/admin/scopes'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'
import { UserRole } from '~/types/user'
import logger from '~/utils/logger'
import { notifications } from '~/utils/notifications'

import RoleEditor from './components/RoleEditor'
import SystemPermsTable from './components/SystemPermsTable'

type Props = {
  userId: string
  role?: UserRole
  scopes?: SystemScope[]
}

type TrackProps = {
  role: UserRole
  selection: string[]
}

const permModified = (initial: TrackProps, current: TrackProps) => {
  if (initial.role !== current.role) {
    return true
  }

  if (initial.selection.length !== current.selection.length) {
    return true
  }

  return (
    JSON.stringify(initial.selection.slice().sort()) !==
    JSON.stringify(current.selection.slice().sort())
  )
}

const SystemPerms = ({ userId, role, scopes }: Props) => {
  const roleVal: UserRole = role ?? UserRole.User
  const selectedScopes: string[] = scopes?.map(s => s.scope) ?? []

  const { data, isLoading, error, refetch } = useCategoryCatalogueScopes(ScopeCategory.System)
  const [roleValue, setRoleValue] = useState(roleVal)
  const [selection, setSelection] = useState(selectedScopes)
  const initialRef = useRef({ role: roleVal, selection: selectedScopes })

  const [saveDisabled, setSaveDisabled] = useState(true)

  const updatePermissionsMutation = useUpdateAccountPermissions(userId)

  const handleSavePermissions = () => {
    updatePermissionsMutation.mutate(
      { role: roleValue, scopes: selection },
      {
        onSuccess: () => {
          logger.log('handleSavePermissions success')

          notifications.showSuccess(`The account permissions were updated.`, { autoClose: true })

          initialRef.current.role = roleValue
          initialRef.current.selection = selection

          setSaveDisabled(true)
        },
        onError: () => {
          logger.log('handleSavePermissions error')

          notifications.showError('Update failed!', {
            description: 'The update of the account permissions failed. Please try again!',
            autoClose: true
          })
        }
      }
    )
  }

  const catalogue = data ?? []

  const toggleRow = (code: string) => {
    const values = selection.includes(code)
      ? selection.filter(item => item !== code)
      : [...selection, code]

    setSelection(values)
    setSaveDisabled(!permModified(initialRef.current, { role: roleValue, selection: values }))
  }
  const toggleAll = () => {
    const values = selection.length === catalogue.length ? [] : catalogue.map(item => item.code)

    setSelection(values)
    setSaveDisabled(!permModified(initialRef.current, { role: roleValue, selection: values }))
  }

  if (error) {
    return <SuggestionsError subject="scopes catalogue" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  const handleRoleChange = (value: string) => {
    const val = value as UserRole

    setSaveDisabled(!permModified(initialRef.current, { role: val, selection: selection }))

    setRoleValue(val)
  }

  return (
    <div>
      <Group>
        <Title order={4}>Manage Role and System Permissions</Title>
        <Button
          variant="light"
          color="teal.4"
          leftIcon={<IconCheckbox size="1rem" />}
          disabled={saveDisabled}
          onClick={handleSavePermissions}
        >
          Save
        </Button>
      </Group>

      <RoleEditor role={roleValue} onRoleChange={handleRoleChange} />

      <SystemPermsTable
        selection={selection}
        catalogue={catalogue}
        toggleRow={toggleRow}
        toggleAll={toggleAll}
      />
    </div>
  )
}

export default SystemPerms
