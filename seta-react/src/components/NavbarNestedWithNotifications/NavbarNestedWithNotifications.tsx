import { Navbar } from '@mantine/core'
import { IconNotes, IconUsers, IconStack } from '@tabler/icons-react'

import { useStyles } from './style'

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
      { label: 'Communities', link: '/community/communities/', icon: IconUsers },
      { label: 'Resources', link: '/community/resources/', icon: IconStack }
    ]
  }
]

const NavbarNestedWithNotifications = () => {
  const { classes } = useStyles()

  const links = mockdata.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Navbar
      height="auto"
      sx={theme => ({
        marginBottom: theme.spacing.xs
      })}
      p="md"
      className={classes.navbar}
    >
      <NavbarNested props={links} />
    </Navbar>
  )
}

export default NavbarNestedWithNotifications
