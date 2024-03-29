import { Avatar, Grid } from '@mantine/core'

import { useExternalProviders } from '~/api/user/user-account'

import ExternalProviders from './components/ExternalProviders'
import GeneralInformation from './components/GeneralInformation'

const ProfileDashboard = () => {
  const { data } = useExternalProviders()

  return (
    <>
      <Grid style={{ marginTop: '-3%' }}>
        <Grid.Col span={12} pb="md">
          <Avatar src={null} alt="profile" w="100%" h="100px" />
        </Grid.Col>
        <Grid.Col span={6}>
          <GeneralInformation details={data} />
        </Grid.Col>
        <Grid.Col span={6}>
          <ExternalProviders details={data} />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProfileDashboard
