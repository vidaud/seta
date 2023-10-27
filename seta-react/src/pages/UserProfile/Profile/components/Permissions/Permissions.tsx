import { Paper, Table, Title, createStyles } from '@mantine/core'

import { useUserPermissions } from '~/api/communities/user-scopes'

import { extractText } from '../../../common/utils/utils'

const useStyles = createStyles(() => ({
  td: {
    fontWeight: 'bold'
  }
}))

const Permissions = () => {
  const { classes } = useStyles()
  const { data } = useUserPermissions()

  const systemPermissions = data?.system_scopes?.map(element => (
    <li key={element.scope}>{extractText(element.scope)}</li>
  ))
  const communityPermissions = data?.community_scopes?.map(element =>
    element.scopes.map(item => <li key={item}>{extractText(item)}</li>)
  )
  const resourcePermissions = data?.resource_scopes?.map(element =>
    element.scopes.map(item => <li key={item}>{extractText(item)}</li>)
  )

  return (
    <Paper shadow="xs" p="md">
      <Title order={5} ta="center">
        Permissions
      </Title>
      <Table verticalSpacing="sm">
        <tbody>
          <tr>
            <td className={classes.td}>System</td>
            <td>
              <ul>
                {systemPermissions && systemPermissions?.length > 0 ? systemPermissions : null}
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>Community</td>
            <td>
              <ul>
                {communityPermissions && communityPermissions?.length > 0
                  ? communityPermissions
                  : null}
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>Resource</td>
            <td>
              <ul>
                {resourcePermissions && resourcePermissions?.length > 0
                  ? resourcePermissions
                  : null}
              </ul>
            </td>
          </tr>
        </tbody>
      </Table>
    </Paper>
  )
}

export default Permissions
