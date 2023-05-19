import { Box, Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import NavbarNested from '../../components/NavbarNested'

const CommunityLayout = () => {
  return (
    <Flex direction="column" className="communities min-h-screen">
      <NavbarNested />

      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Flex>
  )
}

export default CommunityLayout
