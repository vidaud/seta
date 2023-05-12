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

import { useCommunityManagement } from '../../../../../api/communities/community'
import CommunitiesLoading from '../../common/SuggestionsLoading'
import changeRequestAttributes from '../../Dashboard/ChangeRequests/changeRequestAttributes.json'
import ChangeRequests from '../../Dashboard/ChangeRequests/ChangeRequests'
import joinAttributes from '../../Dashboard/LastJoinRequests/joinAttributes.json'
import LastJoinRequests from '../../Dashboard/LastJoinRequests/LastJoinRequests'
import RecentResources from '../../Dashboard/RecentResources/RecentResources'
import resourcesAttributes from '../../Dashboard/RecentResources/resourcesAttributes.json'

const useStyles = createStyles({
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
    { title: 'My Communities', href: 'http://localhost/communities/my-list' },
    { title: 'View Community', href: `http://localhost/communities/details/${id}` },
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
      <div className="page">
        <Group position="right">
          <Button color="orange">+ Invite</Button>
          <Button color="blue">New Resource</Button>
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
                  href="http://localhost/communities/communityname"
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
