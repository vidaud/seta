import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { NotificationsProvider } from '../../pages/CommunitiesPage/pages/contexts/notifications-context'

const AppLayout = () => (
  <Flex direction="column" className="min-h-screen">
    <NotificationsProvider>
      <Header />
    </NotificationsProvider>

    <Flex direction="column" mih="600px" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Flex>

    <Footer />
  </Flex>
)

export default AppLayout
