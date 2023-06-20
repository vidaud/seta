import { useEffect, useState } from 'react'
import { Button, Grid, Group, Text, createStyles, Card } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import ChangeResourceRequests from './components/ChangeResourceRequests/ChangeResourceRequests'
import LimitsDetails from './components/LimitsDetails/LimitsDetails'
import ResourceData from './components/ResourceDetails/ResourceDetails'

import {
  deleteResourceByID,
  useResourceID
} from '../../../../../../api/resources/manage/my-resource'
import { useCurrentUserPermissions } from '../../../../contexts/scope-context'
import ComponentLoading from '../../../common/ComponentLoading'
import ResourceUsersPermissions from '../../../UserPermissions/Resource/ResourceUserPermissions'

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
      <Grid>
        <Grid.Col span={12}>
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>
            <ResourceData resourceId={rows?.resource_id} />
            <Group spacing={30} position="right">
              {scopes?.includes('/seta/resource/edit') ? (
                <Button color="red" onClick={deleteResource}>
                  Delete
                </Button>
              ) : null}
              {scopes?.includes('/seta/resource/edit') ||
              scopes?.includes('/seta/community/manager') ||
              scopes?.includes('/seta/community/owner') ? (
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
        <Grid.Col span={6}>
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Limits</Text>
            </Card.Section>
            <LimitsDetails />
          </Card>
        </Grid.Col>
        {scopes?.includes('/seta/resource/edit') ? (
          <Grid.Col span={6}>
            <Card withBorder radius="md">
              <Card.Section className={classes.imageSection}>
                <Text size="md"> User Permissions</Text>
              </Card.Section>
              <ResourceUsersPermissions />
            </Card>
          </Grid.Col>
        ) : null}
        {scopes?.includes('/seta/resource/edit') ||
        scopes?.includes('/seta/community/manager') ||
        scopes?.includes('seta/community/owner') ? (
          <Grid.Col span={12}>
            <Card withBorder radius="md">
              <Card.Section className={classes.imageSection}>
                <Text size="md"> My Pending Resource Change Requests</Text>
              </Card.Section>
              <ChangeResourceRequests />
            </Card>
          </Grid.Col>
        ) : null}
      </Grid>
    </>
  )
}

export default ViewMyResource
