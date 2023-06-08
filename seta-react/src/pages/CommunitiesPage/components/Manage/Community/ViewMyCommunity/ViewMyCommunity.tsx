import { useEffect, useState } from 'react'
import { Button, Grid, Group, Text, Title, createStyles, Card, Table } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import Stats from './components/Stats/Stats'

import { useMyCommunityID } from '../../../../../../api/communities/manage/my-community'
import { leaveCommunity } from '../../../../../../api/communities/my-membership'
import ComponentLoading from '../../../common/ComponentLoading'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import { useCurrentUserPermissions } from '../../scope-context'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  link: {
    color: 'white'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  }
}))
const ViewMyCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()

  const { data, isLoading } = useMyCommunityID(id)
  const [row, setRow] = useState(data)
  const { community_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string[] | undefined>([])

  useEffect(() => {
    if (data) {
      setRow(data)
      const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

      findCommunity ? setScopes(findCommunity[0].scopes) : setScopes([])
    }
  }, [data, row, community_scopes, id])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const deleteMembership = () => {
    leaveCommunity(id)
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
              {row?.communities.title}
            </Title>
            <Text size="xs" className={classes.text}>
              {row?.communities.description}
            </Text>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Status: {row?.communities.status}</Text>
                  </td>
                  <td className={classes.td} />
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Created at:{' '}
                      {row?.communities?.created_at
                        ? new Date(row?.communities.created_at).toDateString()
                        : null}
                    </Text>
                  </td>
                  <td className={classes.td} />
                </tr>
              </tbody>
            </Table>
            <Group spacing={30} position="right">
              <Link
                className={classes.link}
                to={`/my-communities/${row?.communities.community_id}/manage`}
                replace={true}
              >
                {scopes?.includes('/seta/community/manager') ? (
                  <Button>Manage</Button>
                ) : (
                  <Button variant="filled" size="xs" onClick={() => deleteMembership()}>
                    LEAVE
                  </Button>
                )}
              </Link>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stats
            resourceNumber={row?.resources}
            // inviteNumber={row?.invites}
            // memberNumber={row?.members}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <CommunityResources data={row?.resources} />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewMyCommunity
