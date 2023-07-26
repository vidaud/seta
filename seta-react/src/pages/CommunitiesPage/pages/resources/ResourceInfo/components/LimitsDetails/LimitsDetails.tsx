import { useEffect, useState } from 'react'
import { Group, Text, createStyles } from '@mantine/core'

import { useResourceID } from '../../../../../../../api/resources/manage/my-resource'
import { ComponentLoading } from '../../../../common'
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
      <Group>
        <Text className={classes.text}>
          Total Files: {rows?.community_id ? rows?.limits?.total_files_no : null}
        </Text>
        <Text className={classes.text}>Total Storage: {rows?.limits?.total_storage_mb} Mb</Text>
        <Text className={classes.text}>File Size: {rows?.limits?.file_size_mb} Mb</Text>
      </Group>

      {scopes?.includes('/seta/resource/edit') ? (
        <Group position="right" style={{ paddingTop: '2%' }}>
          <UpdateLimits props={rows} />
        </Group>
      ) : null}
    </>
  )
}

export default LimitsDetails
