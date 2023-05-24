import { useEffect, useState } from 'react'
import { Button, Grid, Group, Paper, Text, Title, createStyles } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'

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
  }
})

const ViewMyResource = () => {
  const { classes } = useStyles()
  const { resourceId } = useParams()
  const navigate = useNavigate()

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
              <Button
                component="a"
                onClick={() => {
                  navigate(`/manage/my-resources/update/${rows?.community_id}/${rows?.resource_id}`)
                }}
              >
                Update
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper shadow="xs" p="md">
            <Group spacing={30} position="right">
              <Button
                className={classes.button}
                component="a"
                onClick={() => {
                  navigate(
                    `/manage/my-resources/details/${rows?.community_id}/${rows?.resource_id}/contribution/new`
                  )
                }}
              >
                Upload
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewMyResource
