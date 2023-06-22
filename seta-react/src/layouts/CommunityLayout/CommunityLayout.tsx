import { Box, Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '../../components/Breadcrumbs'
import NavbarNestedWithNotifications from '../../components/NavbarNestedWithNotifications/NavbarNestedWithNotifications'
import { ScopeProvider } from '../../pages/CommunitiesPage/contexts/scope-context'

const CommunityLayout = () => {
  return (
    <Flex
      direction="column"
      className="communities min-h-screen"
      sx={{ display: '-webkit-inline-box' }}
    >
      <ScopeProvider>
        <NavbarNestedWithNotifications />
      </ScopeProvider>
      <Box sx={{ flexGrow: 1, padding: '2rem' }}>
        <Breadcrumbs readFromPath />
        <Outlet />
      </Box>
    </Flex>
  )
}

export default CommunityLayout
