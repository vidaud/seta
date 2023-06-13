import { useEffect, useState } from 'react'
import { Button, Grid, Group, Text, Title, createStyles, Card, Table } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import {
  deleteResourceByID,
  useResourceID
} from '../../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../../common/ComponentLoading'
import { useCurrentUserPermissions } from '../../scope-context'

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

const ViewMyResource = () => {
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

  const deleteResource = () => {
    deleteResourceByID(rows?.resource_id)
  }

  return (
    <>
      <Grid grow>
        <Grid.Col span={12}>
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>
            <Title order={5} className={classes.title}>
              {rows?.title}
            </Title>
            <Text size="xs" className={classes.text}>
              Abstract: {rows?.abstract}
            </Text>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Community by: {rows?.community_id}</Text>
                  </td>
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
                      Created at:{' '}
                      {rows?.created_at ? new Date(rows?.created_at).toDateString() : null}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Group spacing={30} position="right">
              {scopes?.includes('/seta/resource/data/delete') ? (
                <Button color="red" onClick={deleteResource}>
                  Delete
                </Button>
              ) : null}
              {scopes?.includes('/seta/resource/edit') ? (
                <Link
                  className={classes.link}
                  to={`/my-communities/${rows?.community_id}/${rows?.resource_id}/update`}
                  replace={true}
                >
                  <Button>Update</Button>
                </Link>
              ) : null}
            </Group>
          </Card>
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
