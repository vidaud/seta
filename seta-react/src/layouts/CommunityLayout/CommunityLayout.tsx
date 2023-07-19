import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '../../components/Breadcrumbs'
import NavbarNestedWithNotifications from '../../components/NavbarNestedWithNotifications/NavbarNestedWithNotifications'
import { ScopeProvider } from '../../pages/CommunitiesPage/pages/contexts/scope-context'

const CommunityLayout = () => {
  return (
    <>
      <Flex direction="column" className="communities min-h-screen">
        <Breadcrumbs readFromPath includeCom />

        <Flex sx={{ marginTop: '-3rem', zIndex: 100 }}>
          <ScopeProvider>
            <NavbarNestedWithNotifications />
          </ScopeProvider>

          <Flex direction="column" align="center" sx={{ width: '100%', padding: '2rem' }}>
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default CommunityLayout
