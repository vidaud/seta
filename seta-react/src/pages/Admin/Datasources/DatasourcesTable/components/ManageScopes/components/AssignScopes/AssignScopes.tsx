import type { SelectItem } from '@mantine/core'
import { Group, Button, MultiSelect } from '@mantine/core'

import {
  DatasourceScopesFormProvider,
  useDatasourceScopes
} from '~/pages/Admin/Datasources/contexts/datasource-scopes-context'

import { useAssignScope } from '~/api/admin/datasource_scopes'
import { useAllAccounts } from '~/api/admin/users'
import type { DatasourceScope } from '~/api/types/datasource-scopes-types'
import { notifications } from '~/utils/notifications'

import { useStyles } from '../../../UpdateDatasource/components/style'

const AssignScopes = ({ scopes, datasource_id, close }) => {
  const { classes, cx } = useStyles()
  const setAssignScopeMutation = useAssignScope(datasource_id)
  const { data } = useAllAccounts()
  const users: readonly (string | SelectItem)[] = data
    ? data?.map(item => ({
        label: item.email,
        value: item.username
      }))
    : []

  const form = useDatasourceScopes({
    initialValues: {
      user_id: [],
      scope: []
    }
  })

  const handleSubmit = values => {
    const updated_values: DatasourceScope[] = values.user_id?.map(item =>
      values.scope.map(element => ({
        user_id: item,
        scope: element
      }))
    )

    setAssignScopeMutation.mutate(updated_values, {
      onSuccess: () => {
        notifications.showSuccess(`Data source scopes set.`, { autoClose: true })

        close()
      },
      onError: () => {
        notifications.showError('Data source scopes set failed!', {
          autoClose: true
        })
      }
    })
  }

  return (
    <>
      <DatasourceScopesFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <MultiSelect
            data={users}
            label="User"
            {...form.getInputProps('user_id')}
            className={cx(classes.input)}
            withAsterisk
          />

          <MultiSelect
            data={scopes}
            label="Scope"
            {...form.getInputProps('scope')}
            className={cx(classes.input)}
            withAsterisk
          />
          <Group position="right" pt="md">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                close()
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>

            <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
              Set Scope
            </Button>
          </Group>
        </form>
      </DatasourceScopesFormProvider>
    </>
  )
}

export default AssignScopes
