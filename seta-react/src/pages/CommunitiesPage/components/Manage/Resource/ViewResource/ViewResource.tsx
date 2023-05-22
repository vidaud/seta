import { useEffect, useState } from 'react'
import {
  Anchor,
  Breadcrumbs,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  createStyles
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import {
  deleteResourceByID,
  useResourceID
} from '../../../../../../api/resources/manage/my-resource'
import { environment } from '../../../../../../environments/environment'
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
  }
})

const ViewMyResource = () => {
  const { classes } = useStyles()
  const { resourceId } = useParams()

  const { data, isLoading } = useResourceID(resourceId)
  const [rows, setRows] = useState(data)

  const items = [
    { title: 'My Communities', href: `${environment.COMMUNITIES_API_PATH}/my-list` },
    { title: `${resourceId}` }
  ].map(item => (
    <Anchor href={item.href} key={item.title}>
      {item.title}
    </Anchor>
  ))

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
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="page">
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
                      <Text className={classes.text}>
                        Created at: {rows?.created_at.toString()}
                      </Text>
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
                  href={`${environment.COMMUNITIES_API_PATH}/update/${rows?.community_id}/${rows?.resource_id}`}
                >
                  Update
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ViewMyResource
