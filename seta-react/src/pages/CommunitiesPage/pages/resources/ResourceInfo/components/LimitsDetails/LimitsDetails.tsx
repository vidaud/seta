import { useEffect, useState } from 'react'
import { Group, Text, createStyles, Table } from '@mantine/core'

import { useResourceID } from '../../../../../../../api/resources/manage/my-resource'
import { ComponentLoading } from '../../../../../components/common'
import UpdateLimits from '../UpdateLimits/UpdateLimits'

const useStyles = createStyles(theme => ({
  text: {
    textAlign: 'left'
  },
  table: {
    width: 'auto',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  }
}))

const LimitsDetails = ({ id, scopes }) => {
  const { classes } = useStyles()

  const { data, isLoading } = useResourceID(id)
  const [rows, setRows] = useState(data)

  useEffect(() => {
    if (data) {
      setRows(data)
    }
  }, [data, rows])

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
                Total Files No: {rows?.community_id ? rows?.limits?.total_files_no : null}
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>
                Total Storage Mb: {rows?.limits?.total_storage_mb}
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>File Size Mb: {rows?.limits?.file_size_mb}</Text>
            </td>
          </tr>
        </tbody>
      </Table>
      {scopes?.includes('/seta/resource/edit') ? (
        <Group position="left" style={{ paddingTop: '2%' }}>
          <UpdateLimits props={rows} />
        </Group>
      ) : null}
    </>
  )
}

export default LimitsDetails
