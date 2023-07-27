import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import NavbarNestedWithNotifications from '~/components/NavbarNestedWithNotifications/'
import { CommunityListProvider } from '~/pages/CommunitiesPage/contexts/community-list.context'

import Breadcrumbs from '../../components/Breadcrumbs'

const CommunityLayout = () => {
  return (
    <>
      <Flex direction="column" className="communities min-h-screen">
        {/* <Breadcrumbs readFromPath includeCom /> */}
        <Breadcrumbs readFromPath />

        <Flex sx={{ marginTop: '-3rem', zIndex: 100 }}>
          <CommunityListProvider>
            <NavbarNestedWithNotifications />
          </CommunityListProvider>

          <Flex direction="column" align="center" sx={{ width: '100%', padding: '2rem' }}>
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default CommunityLayout
