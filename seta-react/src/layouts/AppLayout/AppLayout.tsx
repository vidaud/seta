import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import FooterWithCookies from '~/components/FooterWithCookies/FooterWithCookies'

import Header from '../../components/Header'

const AppLayout = () => (
  <Flex direction="column" className="min-h-screen">
    <Header />

    <Flex direction="column" mih="600px" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Flex>

    <FooterWithCookies />
  </Flex>
)

export default AppLayout
