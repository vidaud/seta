import { useEffect } from 'react'
import {
  Button,
  Group,
  Paper,
  Text,
  Grid,
  Anchor,
  Breadcrumbs,
  Title,
  createStyles,
  Table
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useCommunityManagement } from '../../../../../../api/communities/community'
import { environment } from '../../../../../../environments/environment'
import CommunitiesLoading from '../../../common/SuggestionsLoading'
import changeRequestAttributes from '../../../Dashboard/ChangeRequests/changeRequestAttributes.json'
import ChangeRequests from '../../../Dashboard/ChangeRequests/ChangeRequests'
import joinAttributes from '../../../Dashboard/LastJoinRequests/joinAttributes.json'
import LastJoinRequests from '../../../Dashboard/LastJoinRequests/LastJoinRequests'
import RecentResources from '../../../Dashboard/RecentResources/RecentResources'
import resourcesAttributes from '../../../Dashboard/RecentResources/resourcesAttributes.json'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  page: {
    minHeight: '31rem',
    height: 'auto',
    padding: '2rem'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    marginTop: '20px'
  }
})

const ManageCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()
  const { data, isLoading } = useCommunityManagement(id)
  const items = [
    { title: 'My Communities', href: `${environment.COMMUNITIES_API_PATH}/my-list` },
    { title: 'View Community', href: `${environment.COMMUNITIES_API_PATH}/details/${id}` },
    { title: 'Manage Community' }
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

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className={classes.page}>
        <Group position="right">
          <InviteMember id={data?.community_id} />
          <Button
            color="blue"
            component="a"
            href={`${environment.COMMUNITIES_API_PATH}/details/${id}/new`}
          >
            New Resource
          </Button>
        </Group>
        <Grid grow>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={5} className={classes.title}>
                {data?.title}
              </Title>
              <Text className={classes.text}>{data?.description}</Text>
              <Table className={classes.table}>
                <tbody>
                  <tr>
                    <td>Membership: {data?.membership}</td>
                    <td>Created at: {data?.created_at.toString()}</td>
                  </tr>
                  <tr>
                    <td>Data Type: {data?.data_type}</td>
                    <td>Created by: {data?.creator.full_name}</td>
                  </tr>
                  <tr>
                    <td>Status: {data?.status}</td>
                    <td />
                  </tr>
                </tbody>
              </Table>
              <Group spacing={30} position="right">
                <Button
                  color="green"
                  component="a"
                  href={`${environment.COMMUNITIES_API_PATH}/update/${id}`}
                >
                  Update
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={5}>
            <Paper withBorder p="md" radius="md" key="Last Join Requests">
              <LastJoinRequests data={joinAttributes.props.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={7}>
            <Paper withBorder p="md" radius="md" key="Change Requests">
              <ChangeRequests data={changeRequestAttributes.props.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md" key="Recent Resources">
              <RecentResources data={resourcesAttributes.props.data} />
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ManageCommunity
