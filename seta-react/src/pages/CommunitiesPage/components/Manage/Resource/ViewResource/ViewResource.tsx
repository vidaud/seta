import { useEffect } from 'react'
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

import { deleteResourceByID, useResourceID } from '../../../../../../api/communities/resource'
import { environment } from '../../../../../../environments/environment'
import CommunitiesLoading from '../../../common/SuggestionsLoading'

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

  const items = [
    { title: 'My Communities', href: `${environment.COMMUNITIES_API_PATH}/my-list` },
    { title: `${resourceId}` }
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  if (isLoading || !data) {
    return <CommunitiesLoading />
  }

  const deleteResource = () => {
    deleteResourceByID(data.community_id, data.resource_id)
  }

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="page">
        <Grid grow>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={5} className={classes.title}>
                {data.title}
              </Title>
              <Text className={classes.text}>Community: {data.community_id}</Text>
              <Text className={classes.text}>Abstract: {data.abstract}</Text>
              <table className={classes.table}>
                <tbody>
                  <tr>
                    <td className={classes.td}>
                      <Text className={classes.text}>Membership: {data.access}</Text>
                    </td>
                    <td className={classes.td}>
                      <Text className={classes.text}>Status: {data.status}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.td}>
                      <Text className={classes.text}>Created by: {data.creator_id}</Text>
                    </td>
                    <td className={classes.td}>
                      <Text className={classes.text}>Created at: {data.created_at.toString()}</Text>
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
                  href={`${environment.COMMUNITIES_API_PATH}/update/${data.community_id}/${data.resource_id}`}
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
