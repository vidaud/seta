import { useEffect, useState } from 'react'
import { Grid, Paper, Text, Title, createStyles } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourceID } from '../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../common/ComponentLoading'

const useStyles = createStyles({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    width: '100%',
    paddingTop: '1%'
  },
  td: {
    width: '50%'
  },
  button: {
    background: '#F8AE21'
  }
})

const ViewResource = () => {
  const { classes } = useStyles()
  const { id } = useParams()

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
      <Grid grow>
        <Grid.Col span={12}>
          <Paper shadow="xs" p="md">
            <Title order={5} className={classes.title}>
              {rows?.title}
            </Title>
            <Text className={classes.text}>Community: {rows?.community_id}</Text>
            <Text className={classes.text}>Abstract: {rows?.abstract}</Text>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Status: {rows?.status}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Created by: {rows?.creator_id}</Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>Created at: {rows?.created_at.toString()}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewResource
