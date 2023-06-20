import { useEffect, useState } from 'react'
import { Text, Title, createStyles, Table } from '@mantine/core'

import { useResourceID } from '../../../../../../../../api/resources/manage/my-resource'
import { ComponentLoading } from '../../../../../common'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  },
  button: {
    background: '#F8AE21'
  },
  link: {
    color: 'white'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm
  }
}))

const ResourceData = ({ resourceId }) => {
  const { classes } = useStyles()

  const { data, isLoading } = useResourceID(resourceId)
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
      <Title order={5} className={classes.title}>
        {rows?.title ? rows?.title.charAt(0).toUpperCase() + rows?.title.slice(1) : null}
      </Title>
      <Text size="xs" className={classes.text}>
        Abstract:{' '}
        {rows?.abstract ? rows?.abstract.charAt(0).toUpperCase() + rows?.abstract.slice(1) : null}
      </Text>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>
                Community:{' '}
                {rows?.community_id
                  ? rows?.community_id.charAt(0).toUpperCase() + rows?.community_id.slice(1)
                  : null}
              </Text>
            </td>
            <td className={classes.td}>
              <Text className={classes.text}>Status: {rows?.status.toUpperCase()}</Text>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>
              <Text className={classes.text}>Created by: {rows?.creator?.full_name}</Text>
            </td>
            <td className={classes.td}>
              <Text className={classes.text}>
                Created at: {rows?.created_at ? new Date(rows?.created_at).toDateString() : null}
              </Text>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default ResourceData
