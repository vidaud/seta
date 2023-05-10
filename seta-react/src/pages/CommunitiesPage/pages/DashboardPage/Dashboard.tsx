import { Paper, Grid } from '@mantine/core'

import changeRequestAttributes from '../../components/Dashboard/ChangeRequests/changeRequestAttributes.json'
import ChangeRequests from '../../components/Dashboard/ChangeRequests/ChangeRequests'
import attributes from '../../components/Dashboard/DashboardCards/attributes.json'
import DashboardCards from '../../components/Dashboard/DashboardCards/DashboardCards'
import joinAttributes from '../../components/Dashboard/LastJoinRequests/joinAttributes.json'
import LastJoinRequests from '../../components/Dashboard/LastJoinRequests/LastJoinRequests'
import RecentResources from '../../components/Dashboard/RecentResources/RecentResources'
import resourcesAttributes from '../../components/Dashboard/RecentResources/resourcesAttributes.json'
import './style.css'

const CommunityDashboard = () => {
  return (
    <div className="page">
      <DashboardCards data={attributes.props.data} />
      <Grid>
        <Grid.Col xs={5}>
          <Paper withBorder p="md" radius="md" key="Last Join Requests">
            <LastJoinRequests data={joinAttributes.props.data} />
          </Paper>
        </Grid.Col>
        <Grid.Col xs={7}>
          <Paper withBorder p="md" radius="md" key="Change Requests">
            <ChangeRequests data={changeRequestAttributes.props.data} />
          </Paper>
        </Grid.Col>
        <Grid.Col xs={12}>
          <Paper withBorder p="md" radius="md" key="Recent Resources">
            <RecentResources data={resourcesAttributes.props.data} />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default CommunityDashboard
