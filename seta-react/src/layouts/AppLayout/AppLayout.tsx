import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Footer from '~/components/Footer/Footer'
import Tour from '~/components/GetStarted/components/Tour'

import Header from '../../components/Header'

const AppLayout = () => (
  <Flex direction="column" className="min-h-screen">
    <Header />

    <Flex direction="column" mih="600px" sx={{ display: 'grid', flexGrow: 1 }}>
      <Outlet />
    </Flex>
    <Tour />

    <Footer />
  </Flex>
)

export default AppLayout
