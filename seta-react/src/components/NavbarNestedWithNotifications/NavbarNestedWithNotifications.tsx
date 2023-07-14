import { Navbar, createStyles } from '@mantine/core'
import { IconNotes } from '@tabler/icons-react'

import { NotificationsProvider } from '../../pages/CommunitiesPage/pages/contexts/notifications-context'
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup'
import NavbarNested from '../NavbarNested/NavbarNested'
import SidebarNotifications from '../SidebarNotifications/SidebarNotifications'

const mockdata = [
  // {
  //   label: 'Dashboard',
  //   icon: IconGauge,
  //   link: '/dashboard'
  // },
  {
    label: 'Discovery',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Communities', link: '/communities/' },
      { label: 'Resources', link: '/resources/' }
    ]
  }
]

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0
  }
}))

const NavbarNestedWithNotifications = () => {
  const { classes } = useStyles()

  const links = mockdata.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Navbar height={800} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <NotificationsProvider>
        <SidebarNotifications />
      </NotificationsProvider>
      <NavbarNested props={links} />
    </Navbar>
  )
}

export default NavbarNestedWithNotifications
