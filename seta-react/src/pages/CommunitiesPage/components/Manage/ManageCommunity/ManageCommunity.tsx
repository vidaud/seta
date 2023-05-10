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

import changeRequestAttributes from '../../Dashboard/ChangeRequests/changeRequestAttributes.json'
import ChangeRequests from '../../Dashboard/ChangeRequests/ChangeRequests'
import joinAttributes from '../../Dashboard/LastJoinRequests/joinAttributes.json'
import LastJoinRequests from '../../Dashboard/LastJoinRequests/LastJoinRequests'
import RecentResources from '../../Dashboard/RecentResources/RecentResources'
import resourcesAttributes from '../../Dashboard/RecentResources/resourcesAttributes.json'

const items = [
  { title: 'My Communities', href: 'http://localhost/communities/my-list' },
  { title: 'View Community', href: 'http://localhost/communities/communityname' },
  { title: 'Manage Community' }
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
))

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
                Title 1
              </Title>
              <Text className={classes.text}>
                Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
                industries for previewing layouts and visual mockups.
              </Text>
              <Table className={classes.table}>
                <tbody>
                  <tr>
                    <td>Membership: Private</td>
                    <td>Created at: 20 April 2023</td>
                  </tr>
                  <tr>
                    <td>Data Type: Evidence</td>
                    <td>Created by: Adriana</td>
                  </tr>
                  <tr>
                    <td>Status: Active</td>
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
