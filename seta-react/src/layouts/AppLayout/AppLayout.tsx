import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Footer from '~/components/Footer/Footer'

import Header from '../../components/Header'

const AppLayout = () => (
  <Flex direction="column" className="min-h-screen">
    <Header />

    <Flex direction="column" mih="600px" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Flex>

    <Footer />
  </Flex>
)

export default AppLayout
