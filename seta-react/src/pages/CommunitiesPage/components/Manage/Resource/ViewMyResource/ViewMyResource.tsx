import { useEffect, useState } from 'react'
import { Button, Grid, Group, Paper, Text, Title, createStyles } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import {
  deleteResourceByID,
  useResourceID
} from '../../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../../common/ComponentLoading'

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
  },
  link: {
    color: 'white'
  }
})

const ViewMyResource = () => {
  const { classes } = useStyles()
  const { resourceId } = useParams()

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

  const deleteResource = () => {
    deleteResourceByID(rows?.resource_id, rows?.community_id)
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
            <Group spacing={30} position="right">
              <Button color="red" onClick={deleteResource}>
                Delete
              </Button>
              <Link
                className={classes.link}
                to={`/my-resources/${rows?.resource_id}/update`}
                replace={true}
              >
                <Button>Update</Button>
              </Link>
            </Group>
          </Paper>
        </Grid.Col>
        {/* <Grid.Col span={12}>
          <Paper shadow="xs" p="md">
            <Group spacing={30} position="right">
              <Link
                className={classes.link}
                to={`/my-resources/${rows?.resource_id}/contribution/new`}
                replace={true}
              >
                <Button className={classes.button}>
                  Upload
                </Button>
              </Link>        
            </Group>
          </Paper>
        </Grid.Col> */}
      </Grid>
    </>
  )
}

export default ViewMyResource
