import { Box, Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '../../components/Breadcrumbs'
import NavbarNested from '../../components/NavbarNested'
import { ScopeProvider } from '../../pages/CommunitiesPage/components/Manage/scope-context'

const CommunityLayout = () => {
  return (
    <Flex direction="column" className="communities min-h-screen">
      <ScopeProvider>
        <NavbarNested />
      </ScopeProvider>
      <Box sx={{ flexGrow: 1, padding: '2rem' }}>
        <Breadcrumbs readFromPath />
        <Outlet />
      </Box>
    </Flex>
  )
}

export default CommunityLayout
