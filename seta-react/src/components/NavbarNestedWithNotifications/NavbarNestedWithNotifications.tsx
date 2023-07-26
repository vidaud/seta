import { Navbar, createStyles } from '@mantine/core'
import { IconNotes } from '@tabler/icons-react'

import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup'
import NavbarNested from '../NavbarNested/NavbarNested'

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
      { label: 'Resources', link: '/communities/resources/' }
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
      <NavbarNested props={links} />
    </Navbar>
  )
}

export default NavbarNestedWithNotifications
