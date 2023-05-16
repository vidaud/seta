import { Box, Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

const AppLayout = () => {
  return (
    <Flex direction="column" className="min-h-screen">
      <Header />

      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Flex>
  )
}

export default AppLayout
