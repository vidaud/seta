import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '~/components/Breadcrumbs'
import NavbarNestedWithNotifications from '~/components/NavbarNestedWithNotifications/'
import { CommunityListProvider } from '~/pages/CommunitiesPage/contexts/community-list.context'

import { useStyles } from './styles'

const CommunityLayout = () => {
  const { classes } = useStyles()

  return (
    <>
      <Flex direction="column" className="communities min-h-screen">
        {/* <Breadcrumbs readFromPath includeCom /> */}
        <Breadcrumbs readFromPath />

        <Flex sx={{ marginTop: '-3rem', zIndex: 10 }}>
          <CommunityListProvider>
            <NavbarNestedWithNotifications />
          </CommunityListProvider>

          <Flex direction="column" align="center" className={classes.page} sx={{ padding: '2rem' }}>
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default CommunityLayout
