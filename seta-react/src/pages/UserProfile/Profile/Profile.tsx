import { Avatar, Grid } from '@mantine/core'

import { useSetaUserAccount } from '~/api/user/user-account'

import GeneralInformation from './components/GeneralInformation'
import Permissions from './components/Permissions/Permissions'

const ProfileDashboard = () => {
  const { data } = useSetaUserAccount()

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
          <Permissions />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProfileDashboard
