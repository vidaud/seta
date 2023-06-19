import { useEffect, useState } from 'react'
import { Button, Group, Text, Grid, Title, createStyles, Table, Tooltip, Card } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import ChangePrivacy from './components/ChangePrivacy/ChangePrivacy'
import ChangeCommunityRequests from './components/ChangeRequests/ChangeRequests'
import MembershipRequests from './components/MembershipRequests/MembershipRequests'

import { useMyCommunityID } from '../../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../../common/ComponentLoading'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import { useCurrentUserPermissions } from '../../scope-context'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles(theme => ({
  page: {
    minHeight: '31rem',
    height: 'auto'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    marginTop: '20px'
  },
  link: {
    color: 'white'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm
  },
  group: {
    paddingBottom: theme.spacing.md
  }
}))

const ManageCommunity = () => {
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

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [data, row, community_scopes, id])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <div className={classes.page}>
        <Group position="right" className={classes.group}>
          {scopes?.includes('/seta/community/invite') ? (
            <InviteMember id={row?.communities.community_id} />
          ) : null}

          {scopes?.includes('/seta/resource/create') ? (
            <Tooltip label="Add new resource to this community">
              <Link className={classes.link} to={`/my-communities/${id}/new`} replace={true}>
                <Button color="blue">New Resource</Button>
              </Link>
            </Tooltip>
          ) : null}
        </Group>
        <Grid grow>
          <Grid.Col span={12}>
            <Card withBorder radius="md">
              <Card.Section className={classes.imageSection}>
                <Text size="md">Details</Text>
              </Card.Section>
              <Title order={5} className={classes.title}>
                {row?.communities.title
                  ? row?.communities.title.charAt(0).toUpperCase() + row?.communities.title.slice(1)
                  : null}
              </Title>
              <Text className={classes.text}>
                {row?.communities.description
                  ? row?.communities.description.charAt(0).toUpperCase() +
                    row?.communities.description.slice(1)
                  : null}
              </Text>
              <Table className={classes.table}>
                <tbody>
                  <tr>
                    <td>Membership: {row?.communities.membership.toUpperCase()}</td>
                    <td>
                      Created at:{' '}
                      {row?.communities?.created_at
                        ? new Date(row?.communities.created_at).toDateString()
                        : null}
                    </td>
                  </tr>
                  <tr>{/* <td>Data Type: {row?.communities.data_type}</td> */}</tr>
                  <tr>
                    <td>Status: {row?.communities.status.toUpperCase()}</td>
                    <td />
                  </tr>
                </tbody>
              </Table>
              {scopes?.includes('/seta/community/manager') ||
              scopes?.includes('/seta/community/owner') ? (
                <Group position="right">
                  <Tooltip label="Update community details">
                    <Link
                      className={classes.link}
                      to={`/my-communities/${id}/update`}
                      replace={true}
                    >
                      <Button color="green">Update</Button>
                    </Link>
                  </Tooltip>
                  <Tooltip label="Change community privacy">
                    <ChangePrivacy props={row?.communities} />
                  </Tooltip>
                </Group>
              ) : null}
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <CommunityResources data={row?.resources} />
          </Grid.Col>
          {scopes?.includes('/seta/community/manager') ||
          scopes?.includes('/seta/community/manager') ||
          scopes?.includes('seta/community/membership/approve') ? (
            <>
              <Grid.Col span={4}>
                <Card withBorder radius="md">
                  <Card.Section className={classes.imageSection}>
                    <Text size="md">Pending Join Requests</Text>
                  </Card.Section>
                  <MembershipRequests />
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder radius="md">
                  <Card.Section className={classes.imageSection}>
                    <Text size="md">My Pending Community Change Requests</Text>
                  </Card.Section>
                  <ChangeCommunityRequests />
                </Card>
              </Grid.Col>
            </>
          ) : null}
          <Grid.Col span={6} />
        </Grid>
      </div>
    </>
  )
}

export default ManageCommunity
