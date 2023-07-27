import { Navbar, createStyles } from '@mantine/core'
import { IconNotes, IconUsers, IconStack } from '@tabler/icons-react'

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
    <Navbar
      height={800}
      sx={theme => ({
        marginBottom: theme.spacing.xs,
        [`@media (max-width: 89em)`]: {
          width: 'auto'
        },
        [`@media (min-width: 90em)`]: {
          width: 300
        }
      })}
      p="md"
      className={classes.navbar}
    >
      <NavbarNested props={links} />
    </Navbar>
  )
}

export default NavbarNestedWithNotifications
