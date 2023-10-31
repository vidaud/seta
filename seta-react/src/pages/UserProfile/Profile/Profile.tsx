import { Avatar, Grid, Group } from '@mantine/core'

import { useExternalProviders } from '~/api/user/user-account'

import DeleteUser from './components/DeleteUser/DeleteUser'
import ExternalProviders from './components/ExternalProviders'
import GeneralInformation from './components/GeneralInformation'

const ProfileDashboard = () => {
  const { data } = useExternalProviders()

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <Avatar src={null} alt="profile" w="100%" h="100px" />
        </Grid.Col>
        <Grid.Col span={6}>
          <GeneralInformation details={data} />
        </Grid.Col>
        <Grid.Col span={6}>
          <ExternalProviders details={data} />
        </Grid.Col>
      </Grid>
      <Group position="right" mt="lg">
        <DeleteUser />
      </Group>
    </>
  )
}

export default ProfileDashboard
