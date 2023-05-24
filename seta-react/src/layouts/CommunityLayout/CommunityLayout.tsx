import { Box, Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import BreadcrumbsComponent from '../../components/Breadcrumbs/Breadcrumbs'
import NavbarNested from '../../components/NavbarNested'

const CommunityLayout = () => {
  return (
    <Flex direction="column" className="communities min-h-screen">
      <NavbarNested />

      <Box sx={{ flexGrow: 1, padding: '2rem' }}>
        <BreadcrumbsComponent />
        <Outlet />
      </Box>
    </Flex>
  )
}

export default CommunityLayout
