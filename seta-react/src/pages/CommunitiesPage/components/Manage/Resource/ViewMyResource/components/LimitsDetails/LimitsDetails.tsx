import { useEffect, useState } from 'react'
import { Group, Text, createStyles, Table } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourceID } from '../../../../../../../../api/resources/manage/my-resource'
import { ComponentLoading } from '../../../../../common'
import { useCurrentUserPermissions } from '../../../../scope-context'
import UpdateLimits from '../UpdateLimits/UpdateLimits'

const useStyles = createStyles(theme => ({
  text: {
    textAlign: 'left'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  }
}))

const LimitsDetails = () => {
  const { classes } = useStyles()
  const { resourceId } = useParams()

  const { data, isLoading } = useResourceID(resourceId)
  const [rows, setRows] = useState(data)
  const { resource_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string[] | undefined>([])

  useEffect(() => {
    if (data) {
      setRows(data)
      const findResource = resource_scopes?.filter(scope => scope.resource_id === resourceId)

      findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
    }
  }, [data, rows, resource_scopes, resourceId])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>
                Total Files No: {rows?.community_id ? rows?.limits.total_files_no : null}
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>
                Total Storage Mb: {rows?.limits.total_storage_mb}
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>File Size Mb: {rows?.limits.file_size_mb}</Text>
            </td>
          </tr>
        </tbody>
      </Table>
      {scopes?.includes('/seta/resource/edit') ? (
        <Group position="right" style={{ paddingTop: '2%' }}>
          <UpdateLimits props={rows} />
        </Group>
      ) : null}
    </>
  )
}

export default LimitsDetails
